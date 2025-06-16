import { FileUploadSession } from '@generated/prisma/client.js'
import { MultipartFileUploaderProviderInterface } from './MultipartFileUploaderInterface.js'
import { Readable } from 'stream'
import * as fs from 'fs/promises'
import * as path from 'path'
import { createWriteStream } from 'fs'
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
            throw new Error('Upload ID is required')
        }

        return path.join(this.multipartUploadsDir, fileUploadSession.uploadId)
    }

    private getFileUploadSessionFinalPath(fileUploadSession: FileUploadSession): string {
        return path.join(this.uploadsDir, fileUploadSession.path)
    }

    async uploadPart(fileUploadSession: FileUploadSession, body: Buffer | Readable): Promise<void> {
        const tempPath = this.getFileUploadSessionTempPath(fileUploadSession)

        if (body instanceof Buffer) {
            await new Promise<void>((resolve, reject) => {
                const writeStream = createWriteStream(tempPath, { flags: 'a' })

                writeStream.write(body, (error: Error | null | undefined) => {
                    if (error) reject(error)
                    else resolve()
                })
                writeStream.end()
            })
        } else if (body instanceof Readable) {
            await new Promise<void>((resolve, reject) => {
                const writeStream = createWriteStream(tempPath, { flags: 'a' })

                body.pipe(writeStream)
                    .on('finish', () => resolve())
                    .on('error', (error: Error) => reject(error))
            })
        } else {
            throw new Error('Invalid body type: must be Buffer or Readable')
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
    }
} 