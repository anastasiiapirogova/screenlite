import { S3Client } from '@aws-sdk/client-s3'
import { IStorage } from '@/core/ports/storage.interface.ts'
import { S3StorageAdapter } from '@/infrastructure/storage/adapters/s3-storage.adapter.ts'
import { LocalStorageAdapter } from '@/infrastructure/storage/adapters/local-storage.adapter.ts'
import { StorageConfig } from '@/infrastructure/config/types/index.ts'

export class StorageFactory {
    private readonly s3Client: S3Client | undefined

    constructor(s3Client: S3Client | undefined) {
        this.s3Client = s3Client
    }

    create(config: StorageConfig, backendUrl: string, bucket?: string): IStorage {
        switch (config.type) {
            case 's3':
                if (!this.s3Client) {
                    throw new Error('Storage factory: S3 client is not configured')
                }

                return new S3StorageAdapter({ s3Client: this.s3Client, bucket })
            case 'local':
                return new LocalStorageAdapter({ backendUrl })
            default:
                throw new Error(`Unsupported storage type: ${config.type}`)
        }
    }
}