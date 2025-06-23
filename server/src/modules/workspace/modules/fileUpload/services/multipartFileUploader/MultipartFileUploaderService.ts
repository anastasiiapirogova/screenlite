import { FileUploadSession } from '@/generated/prisma/client.js'
import { MultipartFileUploaderProviderInterface } from './MultipartFileUploaderInterface.js'
import { S3MultipartFileUploader } from './S3MultipartFileUploader.js'
import { LocalMultipartFileUploader } from './LocalMultipartFileUploader.js'
import { Request } from 'express'
import { STORAGE_TYPE } from '@/config/screenlite.js'

export class MultipartFileUploaderService {
    private static instance: MultipartFileUploaderService
    private provider: MultipartFileUploaderProviderInterface

    private constructor() {
        this.provider = this.createProvider()
    }

    private createProvider(): MultipartFileUploaderProviderInterface {
        switch (STORAGE_TYPE) {
            case 'local':
                console.log('Screenlite: Multipart upload service initialized with local storage provider')
                return new LocalMultipartFileUploader()
            case 's3':
                console.log('Screenlite: Multipart upload service initialized with s3 storage provider')
                return new S3MultipartFileUploader()
            default:
                throw new Error(`Invalid storage type: ${STORAGE_TYPE}`)
        }
    }

    public static getInstance(): MultipartFileUploaderService {
        if (!MultipartFileUploaderService.instance) {
            MultipartFileUploaderService.instance = new MultipartFileUploaderService()
        }
        return MultipartFileUploaderService.instance
    }

    async initializeUpload(fileUploadSession: FileUploadSession): Promise<{ uploadId: string }> {
        return this.provider.initializeUpload(fileUploadSession)
    }

    async uploadPart(fileUploadSession: FileUploadSession, req: Request, partNumber: number): Promise<void> {
        await this.provider.uploadPart(fileUploadSession, req, partNumber)
    }

    async confirmPartUpload(fileUploadSession: FileUploadSession, partNumber: number): Promise<void> {
        await this.provider.confirmPartUpload(fileUploadSession, partNumber)
    }

    async completeUpload(fileUploadSession: FileUploadSession): Promise<boolean> {
        return await this.provider.completeUpload(fileUploadSession)
    }

    async abortUpload(fileUploadSession: FileUploadSession): Promise<void> {
        await this.provider.abortUpload(fileUploadSession)
    }
} 