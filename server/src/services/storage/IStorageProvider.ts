import { Readable } from 'stream'

export interface IStorageProvider {
    uploadFile(key: string, body: Buffer | Readable, contentType?: string): Promise<void>
    downloadFile(key: string): Promise<Readable | null>
    initializeMultipartUpload(key?: string, contentType?: string): Promise<string>
    uploadPart(key: string, uploadId: string, partNumber: number, body: Buffer): Promise<string>
    completeMultipartUpload(key: string, uploadId: string, parts: { PartNumber: number, ETag: string }[]): Promise<void>
    abortMultipartUpload(key: string, uploadId: string): Promise<void>
    deleteFile(key: string): Promise<void>
    createReadStream(key: string, options?: { start?: number, end?: number }): Promise<Readable>
    getFileUrl(key: string): Promise<string>
    getFileSize(key: string): Promise<number>
} 