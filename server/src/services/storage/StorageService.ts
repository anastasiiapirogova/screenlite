import { Readable } from 'stream'
import { IStorageProvider } from './IStorageProvider.js'
import { S3StorageProvider } from './S3StorageProvider.js'
import { LocalStorageProvider } from './LocalStorageProvider.js'

export class StorageService {
    private static instance: StorageService
    private provider: IStorageProvider

    private constructor() {
        this.provider = this.createProvider()
    }

    private createProvider(): IStorageProvider {
        const storageType = process.env.STORAGE_TYPE?.toLowerCase() || 's3'

        switch (storageType) {
            case 'local':
                console.log('Screenlite: Storage service initialized with local storage provider')
                return new LocalStorageProvider()
            case 's3':
                console.log('Screenlite: Storage service initialized with s3 storage provider')
                return new S3StorageProvider()
            default:
                throw new Error(`Invalid storage type: ${storageType}`)
        }
    }

    public static getInstance(): StorageService {
        if (!StorageService.instance) {
            StorageService.instance = new StorageService()
        }
        return StorageService.instance
    }

    public async uploadFile(key: string, body: Buffer | Readable, contentType?: string): Promise<void> {
        return this.provider.uploadFile(key, body, contentType)
    }

    public async downloadFile(key: string): Promise<Readable | null> {
        return this.provider.downloadFile(key)
    }

    public async initializeMultipartUpload(key: string, contentType?: string): Promise<string> {
        return this.provider.initializeMultipartUpload(key, contentType)
    }

    public async uploadPart(key: string, uploadId: string, partNumber: number, body: Buffer): Promise<string> {
        return this.provider.uploadPart(key, uploadId, partNumber, body)
    }

    public async completeMultipartUpload(key: string, uploadId: string, parts: { PartNumber: number, ETag: string }[]): Promise<void> {
        return this.provider.completeMultipartUpload(key, uploadId, parts)
    }

    public async abortMultipartUpload(key: string, uploadId: string): Promise<void> {
        return this.provider.abortMultipartUpload(key, uploadId)
    }

    public async deleteFile(key: string): Promise<void> {
        return this.provider.deleteFile(key)
    }

    public async createReadStream(key: string, options?: { start?: number, end?: number }): Promise<Readable> {
        return this.provider.createReadStream(key, options)
    }

    public async getFileUrl(key: string): Promise<string> {
        return this.provider.getFileUrl(key)
    }

    public async getFileSize(key: string): Promise<number> {
        return this.provider.getFileSize(key)
    }
}