import {
    PutObjectCommand,
    GetObjectCommand,
    DeleteObjectCommand,
    HeadObjectCommand,
    S3Client
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { Readable } from 'stream'
import { FileNotFoundError } from '@/infrastructure/storage/errors/file-not-found.error.ts'
import { IStorage } from '@/core/ports/storage.interface.ts'

type Config = {
    s3Client: S3Client
    bucket?: string
}

export class S3StorageAdapter implements IStorage {
    private readonly bucket: string
    private readonly s3Client: S3Client

    constructor(config: Config) {
        this.s3Client = config.s3Client
        this.bucket = config.bucket || 'screenlite'
    }

    private async checkFileExists(key: string): Promise<boolean> {
        try {
            const command = new HeadObjectCommand({
                Bucket: this.bucket,
                Key: key
            })

            await this.s3Client.send(command)
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

        await this.s3Client.send(command)
    }

    public async downloadFile(key: string): Promise<Readable | null> {
        try {
            const command = new GetObjectCommand({
                Bucket: this.bucket,
                Key: key
            })

            const response = await this.s3Client.send(command)

            return response.Body as Readable
        } catch (error) {
            if (error instanceof Error && error.name === 'NoSuchKey') {
                return null
            }
            throw error
        }
    }
    
    public async deleteFile(key: string): Promise<void> {
        const command = new DeleteObjectCommand({
            Bucket: this.bucket,
            Key: key
        })

        await this.s3Client.send(command)
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

        const response = await this.s3Client.send(command)

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

        return getSignedUrl(this.s3Client, command, { expiresIn: 3600 })
    }

    public async getFileSize(key: string): Promise<number> {
        const exists = await this.checkFileExists(key)
        
        if (!exists) {
            throw new FileNotFoundError(key)
        }

        const command = new HeadObjectCommand({
            Bucket: this.bucket,
            Key: key
        })

        const response = await this.s3Client.send(command)

        return response.ContentLength || 0
    }

    public async check(): Promise<boolean> {
        const key = '.storage_check'

        try {
            await this.s3Client.send(new PutObjectCommand({
                Bucket: this.bucket,
                Key: key,
                Body: 'check',
            }))
            await this.s3Client.send(new DeleteObjectCommand({
                Bucket: this.bucket,
                Key: key,
            }))
            return true
        } catch (error) {
            console.error('Error checking s3 storage:', error)
            return false
        }
    }
} 