import { S3Client } from '@aws-sdk/client-s3'
import { IStorage } from './storage.interface.ts'

export type StorageFactoryConfig = {
    type: 's3' | 'local'
    s3Options: {
        client: S3Client
        bucket?: string
    }
    localOptions: {
        backendUrl: string
    }
}

export type IStorageFactory = {
    create(config: StorageFactoryConfig): IStorage
}