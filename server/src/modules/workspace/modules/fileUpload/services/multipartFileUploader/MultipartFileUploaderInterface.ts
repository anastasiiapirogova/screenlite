import { FileUploadSession } from '@/generated/prisma/client.ts'
import { Request } from 'express'

export interface MultipartFileUploaderProviderInterface {
    initializeUpload(fileUploadSession: FileUploadSession): Promise<{ uploadId: string }>
    uploadPart(fileUploadSession: FileUploadSession, req: Request, partNumber: number): Promise<void>
    confirmPartUpload(fileUploadSession: FileUploadSession, partNumber: number): Promise<void>
    completeUpload(fileUploadSession: FileUploadSession): Promise<boolean>
    abortUpload(fileUploadSession: FileUploadSession): Promise<void>
} 