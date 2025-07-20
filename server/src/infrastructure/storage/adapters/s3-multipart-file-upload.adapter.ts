import { IMultipartFileUploader } from '@/core/ports/multipart-file-upload.interface.ts'
import { MultipartUpload } from '@/core/entities/multipart-upload.entity.ts'
import { Readable } from 'stream'
import { S3Client, CreateMultipartUploadCommand, UploadPartCommand, CompleteMultipartUploadCommand, AbortMultipartUploadCommand } from '@aws-sdk/client-s3'
import { IEtagStorage } from '@/core/ports/etag-storage.interface.ts'

export class S3MultipartFileUploadAdapter implements IMultipartFileUploader {
    constructor(
        private readonly s3Client: S3Client,
        private readonly bucket: string,
        private readonly etagStore: IEtagStorage
    ) {}

    async initializeUpload(upload: MultipartUpload): Promise<void> {
        const command = new CreateMultipartUploadCommand({
            Bucket: this.bucket,
            Key: upload.path,
            ContentType: upload.mimeType,
        })

        const response = await this.s3Client.send(command)

        if (!response.UploadId) throw new Error('Failed to initialize S3 upload')

        upload.setUploadId(response.UploadId)

        await this.etagStore.initializeUpload(upload.uploadId)
    }

    async uploadPart(
        upload: MultipartUpload,
        stream: Readable,
        partNumber: number,
        contentLength: number
    ): Promise<void> {
        if (!upload.isInitialized) throw new Error('Upload not initialized')

        const command = new UploadPartCommand({
            Bucket: this.bucket,
            Key: upload.path,
            PartNumber: partNumber,
            UploadId: upload.uploadId,
            Body: stream,
            ContentLength: contentLength,
        })

        const response = await this.s3Client.send(command)

        if (!response.ETag) throw new Error('Failed to upload part')
    
        await this.etagStore.storeEtag(upload.uploadId, partNumber, response.ETag)
    }

    async completeUpload(upload: MultipartUpload): Promise<void> {
        if (!upload.isInitialized) throw new Error('Upload not initialized')

        const parts = await this.etagStore.getEtags(upload.uploadId)
        const sortedParts = Array.from(parts.entries())
            .sort((a, b) => a[0] - b[0])
            .map(([partNumber, etag]) => ({
                PartNumber: partNumber,
                ETag: etag,
            }))

        const command = new CompleteMultipartUploadCommand({
            Bucket: this.bucket,
            Key: upload.path,
            UploadId: upload.uploadId,
            MultipartUpload: { Parts: sortedParts },
        })

        await this.s3Client.send(command)
        await this.etagStore.cleanup(upload.uploadId)
    }

    async abortUpload(upload: MultipartUpload): Promise<void> {
        if (!upload.isInitialized) return

        const command = new AbortMultipartUploadCommand({
            Bucket: this.bucket,
            Key: upload.path,
            UploadId: upload.uploadId,
        })

        await this.s3Client.send(command).catch(() => {})
        await this.etagStore.cleanup(upload.uploadId)
    }
}