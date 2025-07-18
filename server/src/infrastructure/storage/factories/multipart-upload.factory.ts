import { MultipartFileUploader } from '@/core/ports/multipart-file-upload.interface.ts'
import { S3MultipartFileUploadAdapter } from '@/infrastructure/storage/adapters/s3-multipart-file-upload.adapter.ts'
import { S3Client } from '@aws-sdk/client-s3'
import { Redis } from 'ioredis'
import { ConfigServiceInterface } from '../../config/config.interface.ts'
import { LocalMultipartFileUploadAdapter } from '../adapters/local-multipart-file-upload.adapter.ts'
import { RedisEtagStorage } from '../services/redis-etag-storage.service.ts'

export class MultipartUploadFactory {
    constructor(
        private readonly config: ConfigServiceInterface,
        private readonly s3Client?: S3Client,
        private readonly redis?: Redis
    ) {}

    createUploader(): MultipartFileUploader {
        const storageConfig = this.config.storage
        const s3Buckets = this.config.s3Buckets

        switch (storageConfig.type) {
            case 's3':
                if (!this.s3Client || !this.redis) {
                    throw new Error('S3 client and Redis are required for S3 uploader')
                }
                
                return new S3MultipartFileUploadAdapter(
                    this.s3Client,
                    s3Buckets.userUploads,
                    new RedisEtagStorage(this.redis)
                )
            default:
                return new LocalMultipartFileUploadAdapter(
                    'storage/uploads',
                    'storage/multipart-uploads'
                )
        }
    }
}