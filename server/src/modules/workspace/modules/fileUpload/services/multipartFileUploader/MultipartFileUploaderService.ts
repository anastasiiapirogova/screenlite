import { FileUploadSession } from '@generated/prisma/client.js'
import { MultipartFileUploaderProviderInterface } from './MultipartFileUploaderInterface.js'
import { S3MultipartFileUploader } from './S3MultipartFileUploader.js'
import { LocalMultipartFileUploader } from './LocalMultipartFileUploader.js'
import { Readable } from 'stream'

export class MultipartFileUploaderService {
    private static instance: MultipartFileUploaderService
    private provider: MultipartFileUploaderProviderInterface

    private constructor() {
        this.provider = this.createProvider()
    }

    private createProvider(): MultipartFileUploaderProviderInterface {
        const storageType = process.env.STORAGE_TYPE?.toLowerCase() || 's3'

        switch (storageType) {
            case 'local':
                console.log('Screenlite: Multipart upload service initialized with local storage provider')
                return new LocalMultipartFileUploader()
            case 's3':
                console.log('Screenlite: Multipart upload service initialized with s3 storage provider')
                return new S3MultipartFileUploader()
            default:
                throw new Error(`Invalid storage type: ${storageType}`)
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

    async uploadPart(fileUploadSession: FileUploadSession, body: Buffer | Readable): Promise<void> {
        await this.provider.uploadPart(fileUploadSession, body)
    }

    async completeUpload(fileUploadSession: FileUploadSession): Promise<void> {
        await this.provider.completeUpload(fileUploadSession)
    }

    async abortUpload(fileUploadSession: FileUploadSession): Promise<void> {
        await this.provider.abortUpload(fileUploadSession)
    }
} 