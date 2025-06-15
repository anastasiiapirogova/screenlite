import { Readable } from 'stream'
import fs from 'fs'
import path from 'path'
import { v4 as uuid } from 'uuid'
import { IStorageProvider } from './IStorageProvider.js'
import { FileNotFoundError } from './errors.js'
import { stat } from 'fs/promises'

// TODO: Instead of creating multiple files for uploading multiple parts, write to a single file
// and then when the upload is complete, move the file to the final location
export class LocalStorageProvider implements IStorageProvider {
    private readonly baseDir: string
    private readonly uploadsDir: string
    private readonly baseUrl: string

    constructor(baseDir: string = process.cwd()) {
        this.baseDir = baseDir
        this.uploadsDir = path.join(this.baseDir, 'storage/uploads')
        this.baseUrl = process.env.BASE_URL || 'http://localhost:3000'
        this.ensureUploadsDir()
    }

    private ensureUploadsDir(): void {
        if (!fs.existsSync(this.uploadsDir)) {
            fs.mkdirSync(this.uploadsDir, { recursive: true })
        }
    }

    private sanitizeKey(key: string): string {
        const sanitized = path.normalize(key).replace(/^(\.\.(\/|\\|$))+/, '')
        
        return sanitized.replace(/^[/\\]/, '')
    }

    private getFilePath(key: string): string {
        const sanitizedKey = this.sanitizeKey(key)
        
        return path.join(this.uploadsDir, sanitizedKey)
    }

    private async checkFileExists(key: string): Promise<boolean> {
        try {
            await fs.promises.access(this.getFilePath(key))
            return true
        } catch {
            return false
        }
    }

    public async uploadFile(key: string, body: Buffer | Readable): Promise<void> {
        const filePath = this.getFilePath(key)
        const dirPath = path.dirname(filePath)

        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true })
        }

        if (body instanceof Buffer) {
            await fs.promises.writeFile(filePath, body)
        } else if (body instanceof Readable) {
            const writeStream = fs.createWriteStream(filePath)

            await new Promise<void>((resolve, reject) => {
                body.pipe(writeStream)
                writeStream.on('finish', resolve)
                writeStream.on('error', reject)
            })
        }
    }

    public async downloadFile(key: string): Promise<Readable | null> {
        const filePath = this.getFilePath(key)

        try {
            if (!fs.existsSync(filePath)) {
                return null
            }

            return fs.createReadStream(filePath)
        } catch (error) {
            console.error('Error reading file:', error)
            return null
        }
    }

    public async initializeMultipartUpload(): Promise<string> {
        const uploadId = uuid()
        const tempDir = path.join(this.uploadsDir, 'multipart', uploadId)
        
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive: true })
        }

        return uploadId
    }

    public async uploadPart(key: string, uploadId: string, partNumber: number, body: Buffer): Promise<string> {
        const tempDir = path.join(this.uploadsDir, 'multipart', uploadId)
        const partPath = path.join(tempDir, `part-${partNumber}`)

        await fs.promises.writeFile(partPath, body)
        
        return `"${partNumber}-${Date.now()}"`
    }

    public async completeMultipartUpload(key: string, uploadId: string, parts: { PartNumber: number, ETag: string }[]): Promise<void> {
        const tempDir = path.join(this.uploadsDir, 'multipart', uploadId)
        const filePath = this.getFilePath(key)
        const dirPath = path.dirname(filePath)

        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true })
        }

        const writeStream = fs.createWriteStream(filePath)
        
        const sortedParts = parts.sort((a, b) => a.PartNumber - b.PartNumber)

        for (const part of sortedParts) {
            const partPath = path.join(tempDir, `part-${part.PartNumber}`)
            const partStream = fs.createReadStream(partPath)

            await new Promise<void>((resolve, reject) => {
                partStream.pipe(writeStream, { end: false })
                partStream.on('end', resolve)
                partStream.on('error', reject)
            })
        }

        writeStream.end()

        await fs.promises.rm(tempDir, { recursive: true, force: true })
    }

    public async abortMultipartUpload(key: string, uploadId: string): Promise<void> {
        const tempDir = path.join(this.uploadsDir, 'multipart', uploadId)

        await fs.promises.rm(tempDir, { recursive: true, force: true })
    }

    public async deleteFile(key: string): Promise<void> {
        const filePath = this.getFilePath(key)
        
        if (fs.existsSync(filePath)) {
            await fs.promises.unlink(filePath)
        }
    }

    public async createReadStream(key: string, options?: { start?: number, end?: number }): Promise<Readable> {
        const exists = await this.checkFileExists(key)

        if (!exists) {
            throw new FileNotFoundError(key)
        }

        const filePath = this.getFilePath(key)

        return fs.createReadStream(filePath, options)
    }

    public async getFileUrl(key: string): Promise<string> {
        const exists = await this.checkFileExists(key)
        
        if (!exists) {
            throw new FileNotFoundError(key)
        }

        const sanitizedKey = this.sanitizeKey(key)
        
        return `${this.baseUrl}/api/static/uploads/${sanitizedKey}`
    }

    public async getFileSize(key: string): Promise<number> {
        const filePath = this.getFilePath(key)
        
        try {
            const stats = await stat(filePath)

            return stats.size
        } catch (err) {
            if (err instanceof Error && 'code' in err && err.code === 'ENOENT') {
                throw new FileNotFoundError(key)
            }
            throw err
        }
    }
} 