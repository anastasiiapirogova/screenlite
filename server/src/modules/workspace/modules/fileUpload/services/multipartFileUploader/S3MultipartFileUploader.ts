import { S3Client, CreateMultipartUploadCommand, UploadPartCommand, CompleteMultipartUploadCommand, AbortMultipartUploadCommand } from '@aws-sdk/client-s3'
import { FileUploadSession } from '@generated/prisma/client.js'
import { MultipartFileUploaderProviderInterface } from './MultipartFileUploaderInterface.js'
import { Readable } from 'stream'
import { getRedisClient } from '@config/redis.js'
import { Buckets, s3Client } from '@config/s3Client.js'

export class S3MultipartFileUploader implements MultipartFileUploaderProviderInterface {
    private s3Client: S3Client
    private bucket: string
    private redis: ReturnType<typeof getRedisClient>

    constructor() {
        this.s3Client = s3Client

        this.bucket = Buckets.uploads
        this.redis = getRedisClient()
    }

    private getRedisKey(fileUploadSessionId: string): string {
        return `fileUploadSession:${fileUploadSessionId}`
    }

    async initializeUpload(fileUploadSession: FileUploadSession): Promise<{ uploadId: string }> {
        const command = new CreateMultipartUploadCommand({
            Bucket: this.bucket,
            Key: fileUploadSession.path,
            ContentType: fileUploadSession.mimeType,
        })

        const response = await this.s3Client.send(command)

        if (!response.UploadId) {
            throw new Error('FAILED_TO_INIT_S3_MULTIPART_UPLOAD')
        }

        const redisKey = this.getRedisKey(fileUploadSession.id)

        await this.redis.hset(redisKey, 'uploadId', response.UploadId)
        await this.redis.expire(redisKey, 3 * 24 * 60 * 60)

        return { uploadId: response.UploadId }
    }

    async uploadPart(fileUploadSession: FileUploadSession, body: Buffer | Readable, partNumber: number): Promise<void> {
        if (!fileUploadSession.uploadId) {
            throw new Error('Upload ID is required')
        }

        const redisKey = this.getRedisKey(fileUploadSession.id)

        const command = new UploadPartCommand({
            Bucket: this.bucket,
            Key: fileUploadSession.path,
            PartNumber: partNumber,
            UploadId: fileUploadSession.uploadId,
            Body: body,
        })

        const response = await this.s3Client.send(command)

        if (!response.ETag) {
            throw new Error('FAILED_TO_UPLOAD_PART')
        }

        await this.redis.hset(redisKey, `part:${partNumber}`, response.ETag)
    }

    async confirmPartUpload(fileUploadSession: FileUploadSession, partNumber: number): Promise<void> {
        // For S3, parts are automatically confirmed when uploaded
        // This method is a no-op for S3 as parts are managed by AWS
        const redisKey = this.getRedisKey(fileUploadSession.id)

        // Verify the part exists in Redis
        const partEtag = await this.redis.hget(redisKey, `part:${partNumber}`)

        if (!partEtag) {
            throw new Error(`Part ${partNumber} not found in upload session`)
        }
    }

    async completeUpload(fileUploadSession: FileUploadSession): Promise<void> {
        if (!fileUploadSession.uploadId) {
            throw new Error('UPLOAD_ID_IS_REQUIRED')
        }

        const redisKey = this.getRedisKey(fileUploadSession.id)

        const parts = await this.redis.hgetall(redisKey)

        const formattedParts = Object.entries(parts)
            .filter(([key]) => key.startsWith('part:'))
            .map(([key, etag]) => ({
                PartNumber: parseInt(key.split(':')[1]),
                ETag: etag.replace(/"/g, ''),
            }))
            .sort((a, b) => a.PartNumber - b.PartNumber)

        const command = new CompleteMultipartUploadCommand({
            Bucket: this.bucket,
            Key: fileUploadSession.path,
            UploadId: fileUploadSession.uploadId,
            MultipartUpload: {
                Parts: formattedParts,
            },
        })

        await this.s3Client.send(command)
        await this.redis.del(redisKey)
    }

    async abortUpload(fileUploadSession: FileUploadSession): Promise<void> {
        const redisKey = this.getRedisKey(fileUploadSession.id)

        if (fileUploadSession.uploadId) {
            const command = new AbortMultipartUploadCommand({
                Bucket: this.bucket,
                Key: fileUploadSession.path,
                UploadId: fileUploadSession.uploadId,
            })

            await this.s3Client.send(command)
        }

        await this.redis.del(redisKey)
    }
} 