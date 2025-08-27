import { Readable } from 'stream'

export interface FileMetadata {
    key: string
    size: number
    mimeType: string
    lastModified: Date
    etag?: string
}

export type IStorage = {
    uploadFile(key: string, body: Buffer | Readable, contentType?: string): Promise<void>
    getFileBuffer(key: string): Promise<Buffer>
    getMetadata(key: string): Promise<FileMetadata>
    deleteFile(key: string): Promise<void>
    getReadStream(key: string, options?: { start?: number, end?: number }): Promise<Readable>
    getFileUrl(key: string): Promise<string>
    getFileSize(key: string): Promise<number>
    check(): Promise<boolean>
}