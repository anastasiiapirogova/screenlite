import {
    PutObjectCommand,
    GetObjectCommand,
    CreateMultipartUploadCommand,
    CompleteMultipartUploadCommand,
    AbortMultipartUploadCommand,
    UploadPartCommand
} from '@aws-sdk/client-s3'
import { Readable } from 'stream'
import fs from 'fs'
import path from 'path'
import sharp from 'sharp'
import { s3Client, Buckets } from '@config/s3Client.js'

export class StorageService {
    // Get bucket name by key
    public static getBucket(key: keyof typeof Buckets): string {
        return Buckets[key]
    }

    // Upload a file to S3
    public static async uploadFile(key: string, body: Buffer | Readable, contentType?: string): Promise<void> {
        const command = new PutObjectCommand({
            Bucket: Buckets.uploads,
            Key: key,
            Body: body,
            ContentType: contentType
        })

        await s3Client.send(command)
    }

    // Download a file from S3
    public static async downloadFile(key: string): Promise<Readable | null> {
        try {
            const command = new GetObjectCommand({
                Bucket: Buckets.uploads,
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

    // Store a file locally from S3
    public static async storeFileLocally(s3Key: string, localFilePath: string): Promise<void> {
        const fileStream = fs.createWriteStream(localFilePath)
        const s3Stream = await this.downloadFile(s3Key)

        if (!s3Stream) {
            throw new Error('File not found in S3')
        }

        fs.mkdirSync(path.dirname(localFilePath), { recursive: true })
        s3Stream.pipe(fileStream)

        return new Promise<void>((resolve, reject) => {
            fileStream.on('finish', resolve)
            fileStream.on('error', reject)
        })
    }

    // Initialize multipart upload
    public static async initializeMultipartUpload(key: string, contentType?: string): Promise<string> {
        const command = new CreateMultipartUploadCommand({
            Bucket: Buckets.uploads,
            Key: key,
            ContentType: contentType
        })

        const response = await s3Client.send(command)

        if (!response.UploadId) {
            throw new Error('Failed to initialize multipart upload')
        }

        return response.UploadId
    }

    // Upload a part in multipart upload
    public static async uploadPart(key: string, uploadId: string, partNumber: number, body: Buffer): Promise<string> {
        const command = new UploadPartCommand({
            Bucket: Buckets.uploads,
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

    // Complete multipart upload
    public static async completeMultipartUpload(key: string, uploadId: string, parts: { PartNumber: number, ETag: string }[]): Promise<void> {
        const command = new CompleteMultipartUploadCommand({
            Bucket: Buckets.uploads,
            Key: key,
            UploadId: uploadId,
            MultipartUpload: {
                Parts: parts
            }
        })

        await s3Client.send(command)
    }

    // Abort multipart upload
    public static async abortMultipartUpload(key: string, uploadId: string): Promise<void> {
        const command = new AbortMultipartUploadCommand({
            Bucket: Buckets.uploads,
            Key: key,
            UploadId: uploadId
        })

        await s3Client.send(command)
    }

    // Upload and process image
    public static async uploadAndProcessImage(key: string, imageBuffer: Buffer, options?: {
        width?: number
        height?: number
        format?: 'jpeg' | 'png' | 'webp'
        quality?: number
    }): Promise<void> {
        let processedImage = sharp(imageBuffer)

        if (options?.width || options?.height) {
            processedImage = processedImage.resize(options.width, options.height, {
                fit: 'cover',
                background: { r: 255, g: 255, b: 255 }
            })
        }

        if (options?.format) {
            processedImage = processedImage[options.format]({
                quality: options?.quality || 80
            })
        }

        const processedBuffer = await processedImage.toBuffer()

        await this.uploadFile(key, processedBuffer, `image/${options?.format || 'jpeg'}`)
    }
}
