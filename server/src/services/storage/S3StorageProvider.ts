import {
    PutObjectCommand,
    GetObjectCommand,
    CreateMultipartUploadCommand,
    CompleteMultipartUploadCommand,
    AbortMultipartUploadCommand,
    UploadPartCommand,
    DeleteObjectCommand,
    HeadObjectCommand
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { Readable } from 'stream'
import { s3Client, Buckets, createBuckets } from '@config/s3Client.js'
import { IStorageProvider } from './IStorageProvider.js'
import { FileNotFoundError } from './errors.js'

export class S3StorageProvider implements IStorageProvider {
    private readonly bucket: string

    constructor(bucket: keyof typeof Buckets = 'uploads') {
        this.bucket = Buckets[bucket]
        createBuckets()
    }

    private async checkFileExists(key: string): Promise<boolean> {
        try {
            const command = new HeadObjectCommand({
                Bucket: this.bucket,
                Key: key
            })

            await s3Client.send(command)
            return true
        } catch (error) {
            if (error instanceof Error && error.name === 'NotFound') {
                return false
            }
            throw error
        }
    }

    public async uploadFile(key: string, body: Buffer | Readable, contentType?: string): Promise<void> {
        const command = new PutObjectCommand({
            Bucket: this.bucket,
            Key: key,
            Body: body,
            ContentType: contentType
        })

        await s3Client.send(command)
    }

    public async downloadFile(key: string): Promise<Readable | null> {
        try {
            const command = new GetObjectCommand({
                Bucket: this.bucket,
                Key: key
            })

            const response = await s3Client.send(command)

            return response.Body as Readable
        } catch (error) {
            if (error instanceof Error && error.name === 'NoSuchKey') {
                return null
            }
            throw error
        }
    }

    public async initializeMultipartUpload(key: string, contentType?: string): Promise<string> {
        const command = new CreateMultipartUploadCommand({
            Bucket: this.bucket,
            Key: key,
            ContentType: contentType
        })

        const response = await s3Client.send(command)

        if (!response.UploadId) {
            throw new Error('Failed to initialize multipart upload')
        }

        return response.UploadId
    }

    public async uploadPart(key: string, uploadId: string, partNumber: number, body: Buffer): Promise<string> {
        const command = new UploadPartCommand({
            Bucket: this.bucket,
            Key: key,
            PartNumber: partNumber,
            UploadId: uploadId,
            Body: body
        })

        const response = await s3Client.send(command)

        if (!response.ETag) {
            throw new Error('Failed to upload part')
        }

        return response.ETag
    }

    public async completeMultipartUpload(key: string, uploadId: string, parts: { PartNumber: number, ETag: string }[]): Promise<void> {
        const command = new CompleteMultipartUploadCommand({
            Bucket: this.bucket,
            Key: key,
            UploadId: uploadId,
            MultipartUpload: {
                Parts: parts
            }
        })

        await s3Client.send(command)
    }

    public async abortMultipartUpload(key: string, uploadId: string): Promise<void> {
        const command = new AbortMultipartUploadCommand({
            Bucket: this.bucket,
            Key: key,
            UploadId: uploadId
        })

        await s3Client.send(command)
    }

    public async deleteFile(key: string): Promise<void> {
        const command = new DeleteObjectCommand({
            Bucket: this.bucket,
            Key: key
        })

        await s3Client.send(command)
    }

    public async createReadStream(key: string, options?: { start?: number, end?: number }): Promise<Readable> {
        const exists = await this.checkFileExists(key)

        if (!exists) {
            throw new FileNotFoundError(key)
        }

        const command = new GetObjectCommand({
            Bucket: this.bucket,
            Key: key,
            Range: options ? `bytes=${options.start || 0}-${options.end || ''}` : undefined
        })

        const response = await s3Client.send(command)

        return response.Body as Readable
    }

    public async getFileUrl(key: string): Promise<string> {
        const exists = await this.checkFileExists(key)
        
        if (!exists) {
            throw new FileNotFoundError(key)
        }

        const command = new GetObjectCommand({
            Bucket: this.bucket,
            Key: key
        })

        return getSignedUrl(s3Client, command, { expiresIn: 3600 })
    }

    public async getFileSize(key: string): Promise<number> {
        const command = new HeadObjectCommand({
            Bucket: this.bucket,
            Key: key
        })

        const response = await s3Client.send(command)

        if (!response.ContentLength) {
            throw new FileNotFoundError(key)
        }

        return response.ContentLength
    }
} 