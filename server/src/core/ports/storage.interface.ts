import { Readable } from 'stream'

export type IStorage = {
    uploadFile(key: string, body: Buffer | Readable, contentType?: string): Promise<void>
    downloadFile(key: string): Promise<Readable | null>
    deleteFile(key: string): Promise<void>
    createReadStream(key: string, options?: { start?: number, end?: number }): Promise<Readable>
    getFileUrl(key: string): Promise<string>
    getFileSize(key: string): Promise<number>
    check(): Promise<boolean>
}