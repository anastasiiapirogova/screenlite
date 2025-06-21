import { Readable } from 'stream'
import { S3StorageProvider } from './providers/S3StorageProvider.js'
import { LocalStorageProvider } from './providers/LocalStorageProvider.js'
import { StorageProviderInterface } from './providers/StorageProviderInterface.js'
import { STORAGE_TYPE } from '@config/screenlite.js'

export class StorageService {
    private static instance: StorageService
    private provider: StorageProviderInterface

    private constructor() {
        this.provider = this.createProvider()
    }

    private createProvider(): StorageProviderInterface {
        switch (STORAGE_TYPE) {
            case 'local':
                console.log('Screenlite: Storage service initialized with local storage provider')
                return new LocalStorageProvider()
            case 's3':
                console.log('Screenlite: Storage service initialized with s3 storage provider')
                return new S3StorageProvider()
            default:
                throw new Error(`Invalid storage type: ${STORAGE_TYPE}`)
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