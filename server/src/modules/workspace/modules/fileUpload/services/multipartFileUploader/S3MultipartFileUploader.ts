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
            throw new Error('Failed to initialize S3 multipart upload')
        }

        const redisKey = this.getRedisKey(fileUploadSession.id)

        await this.redis.hset(redisKey, 'uploadId', response.UploadId)
        await this.redis.expire(redisKey, 3 * 24 * 60 * 60)

        return { uploadId: response.UploadId }
    }

    async uploadPart(fileUploadSession: FileUploadSession, body: Buffer | Readable): Promise<void> {
        if (!fileUploadSession.uploadId) {
            throw new Error('Upload ID is required')
        }

        const redisKey = this.getRedisKey(fileUploadSession.id)

        const command = new UploadPartCommand({
            Bucket: this.bucket,
            Key: fileUploadSession.path,
            PartNumber: fileUploadSession.uploadedParts + 1,
            UploadId: fileUploadSession.uploadId,
            Body: body,
        })

        const response = await this.s3Client.send(command)

        if (!response.ETag) {
            throw new Error('Failed to upload part to S3')
        }

        await this.redis.hset(redisKey, `part:${fileUploadSession.uploadedParts + 1}`, response.ETag)
    }

    async completeUpload(fileUploadSession: FileUploadSession): Promise<void> {
        if (!fileUploadSession.uploadId) {
            throw new Error('Upload ID is required')
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