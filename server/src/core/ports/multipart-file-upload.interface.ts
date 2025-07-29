import { MultipartUpload } from '@/core/entities/multipart-upload.entity.ts'
import { Readable } from 'stream'

export type IMultipartFileUploader = {
    initializeUpload(upload: MultipartUpload): Promise<void>
    uploadPart(
        upload: MultipartUpload,
        stream: Readable,
        partNumber: number,
        contentLength: number
    ): Promise<void>
    completeUpload(upload: MultipartUpload): Promise<void>
    abortUpload(upload: MultipartUpload): Promise<void>
}