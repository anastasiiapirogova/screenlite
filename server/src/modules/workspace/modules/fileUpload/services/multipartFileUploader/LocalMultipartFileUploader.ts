import { FileUploadSession } from '@/generated/prisma/client.js'
import { MultipartFileUploaderProviderInterface } from './MultipartFileUploaderInterface.js'
import { Readable } from 'stream'
import * as fs from 'fs/promises'
import * as path from 'path'
import { createWriteStream, createReadStream } from 'fs'
import { v4 as uuid } from 'uuid'
import { Request } from 'express'
import { STORAGE_MULTIPART_UPLOADS_DIR, STORAGE_UPLOADS_DIR } from '@/config/files.js'

export class LocalMultipartFileUploader implements MultipartFileUploaderProviderInterface {
    private uploadsDir: string
    private multipartUploadsDir: string

    constructor() {
        this.uploadsDir = STORAGE_UPLOADS_DIR
        this.multipartUploadsDir = STORAGE_MULTIPART_UPLOADS_DIR
    }

    private async ensureDirectoryExists(filePath: string): Promise<void> {
        try {
            const dir = path.dirname(filePath)

            await fs.mkdir(dir, { recursive: true })
        } catch (error) {
            console.error(`Failed to create directory for path ${filePath}:`, error)
        }
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

    async uploadPart(fileUploadSession: FileUploadSession, req: Request, partNumber: number): Promise<void> {
        const partPath = this.getPartFilePath(fileUploadSession, partNumber)

        await this.ensureDirectoryExists(partPath)

        // Check if part file already exists and delete it if so
        // This handles cases where a previous upload was incomplete or failed
        try {
            await fs.access(partPath)
            // If no error, file exists - delete it to allow retry
            await fs.unlink(partPath)
        } catch (err: unknown) {
            if (typeof err === 'object' && err !== null && 'code' in err && (err as { code?: string }).code !== 'ENOENT') {
                throw err
            }
            // else, file does not exist, proceed
        }

        if (req instanceof Buffer) {
            await new Promise<void>((resolve, reject) => {
                const writeStream = createWriteStream(partPath, { flags: 'w' })

                writeStream.write(req, (error: Error | null | undefined) => {
                    if (error) reject(error)
                    else resolve()
                })
                writeStream.end()
            })
        } else if (req instanceof Readable) {
            await new Promise<void>((resolve, reject) => {
                const writeStream = createWriteStream(partPath, { flags: 'w' })

                req.pipe(writeStream)
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

    async completeUpload(fileUploadSession: FileUploadSession): Promise<boolean> {
        const tempPath = this.getFileUploadSessionTempPath(fileUploadSession)
        const finalPath = this.getFileUploadSessionFinalPath(fileUploadSession)

        await this.ensureDirectoryExists(finalPath)

        await fs.rename(tempPath, finalPath)

        return true
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