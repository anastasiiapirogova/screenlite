import { FileUploadSession } from '@generated/prisma/client.js'
import { Readable } from 'stream'

export interface MultipartFileUploaderProviderInterface {
    initializeUpload(fileUploadSession: FileUploadSession): Promise<{ uploadId: string }>
    uploadPart(fileUploadSession: FileUploadSession, body: Buffer | Readable): Promise<void>
    completeUpload(fileUploadSession: FileUploadSession): Promise<void>
    abortUpload(fileUploadSession: FileUploadSession): Promise<void>
} 