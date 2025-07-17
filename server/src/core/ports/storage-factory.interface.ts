import { S3Client } from '@aws-sdk/client-s3'
import { StorageInterface } from './storage.interface.ts'

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

export type StorageFactoryInterface = {
    create(config: StorageFactoryConfig): StorageInterface
}