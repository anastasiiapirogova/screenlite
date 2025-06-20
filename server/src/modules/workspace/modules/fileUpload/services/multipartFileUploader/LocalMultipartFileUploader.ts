import { FileUploadSession } from '@generated/prisma/client.js'
import { MultipartFileUploaderProviderInterface } from './MultipartFileUploaderInterface.js'
import { Readable } from 'stream'
import * as fs from 'fs/promises'
import * as path from 'path'
import { createWriteStream, createReadStream } from 'fs'
import { v4 as uuid } from 'uuid'

export class LocalMultipartFileUploader implements MultipartFileUploaderProviderInterface {
    private uploadsDir: string
    private multipartUploadsDir: string

    constructor() {
        this.uploadsDir = 'storage/uploads'
        this.multipartUploadsDir = 'storage/multipartUploads'
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async initializeUpload(fileUploadSession: FileUploadSession): Promise<{ uploadId: string }> {
        const uploadId = uuid()

        return { uploadId }
    }

    private getFileUploadSessionTempPath(fileUploadSession: FileUploadSession): string {
        if (!fileUploadSession.uploadId) {
            throw new Error('UPLOAD_ID_IS_REQUIRED')
        }

        return path.join(this.multipartUploadsDir, fileUploadSession.uploadId)
    }

    private getPartFilePath(fileUploadSession: FileUploadSession, partNumber: number): string {
        const basePath = this.getFileUploadSessionTempPath(fileUploadSession)

        return `${basePath}_part_${partNumber}`
    }

    private getFileUploadSessionFinalPath(fileUploadSession: FileUploadSession): string {
        return path.join(this.uploadsDir, fileUploadSession.path)
    }

    async uploadPart(fileUploadSession: FileUploadSession, body: Buffer | Readable, partNumber: number): Promise<void> {
        const partPath = this.getPartFilePath(fileUploadSession, partNumber)

        if (body instanceof Buffer) {
            await new Promise<void>((resolve, reject) => {
                const writeStream = createWriteStream(partPath, { flags: 'w' })

                writeStream.write(body, (error: Error | null | undefined) => {
                    if (error) reject(error)
                    else resolve()
                })
                writeStream.end()
            })
        } else if (body instanceof Readable) {
            await new Promise<void>((resolve, reject) => {
                const writeStream = createWriteStream(partPath, { flags: 'w' })

                body.pipe(writeStream)
                    .on('finish', () => resolve())
                    .on('error', (error: Error) => reject(error))
            })
        } else {
            throw new Error('INVALID_BODY_TYPE')
        }
    }

    async confirmPartUpload(fileUploadSession: FileUploadSession, partNumber: number): Promise<void> {
        const partPath = this.getPartFilePath(fileUploadSession, partNumber)
        const mainFilePath = this.getFileUploadSessionTempPath(fileUploadSession)

        try {
            await fs.access(partPath)
        } catch {
            throw new Error(`Part file not found: ${partPath}`)
        }

        await new Promise<void>((resolve, reject) => {
            const readStream = createReadStream(partPath)
            const writeStream = createWriteStream(mainFilePath, { flags: 'a' })

            readStream.pipe(writeStream)
                .on('finish', () => resolve())
                .on('error', (error: Error) => reject(error))
        })

        try {
            await fs.unlink(partPath)
        } catch {
            // Ignore errors if file doesn't exist
        }
    }

    async completeUpload(fileUploadSession: FileUploadSession): Promise<void> {
        const tempPath = this.getFileUploadSessionTempPath(fileUploadSession)
        const finalPath = this.getFileUploadSessionFinalPath(fileUploadSession)

        await fs.mkdir(path.dirname(finalPath), { recursive: true })

        await fs.rename(tempPath, finalPath)
    }

    async abortUpload(fileUploadSession: FileUploadSession): Promise<void> {
        const tempPath = this.getFileUploadSessionTempPath(fileUploadSession)

        try {
            await fs.unlink(tempPath)
        } catch {
            // Ignore errors if file doesn't exist
        }

        const basePath = this.getFileUploadSessionTempPath(fileUploadSession)
        const dir = path.dirname(basePath)
        const baseName = path.basename(basePath)
        
        try {
            const files = await fs.readdir(dir)
            const partFiles = files.filter(file => file.startsWith(baseName + '_part_'))
            
            for (const partFile of partFiles) {
                try {
                    await fs.unlink(path.join(dir, partFile))
                } catch {
                    // Ignore errors if file doesn't exist
                }
            }
        } catch {
            // Ignore errors if directory doesn't exist
        }
    }
} 