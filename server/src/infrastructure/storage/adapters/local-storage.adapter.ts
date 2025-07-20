import { Readable } from 'stream'
import fs from 'fs'
import path from 'path'
import { FileNotFoundError } from '../errors/file-not-found.error.ts'
import { stat } from 'fs/promises'
import { IStorage } from '@/core/ports/storage.interface.ts'

type Config = {
    backendUrl: string
}

export class LocalStorageAdapter implements IStorage {
    private readonly storageDir: string = 'storage'
    private readonly backendUrl: string

    constructor(config: Config) {
        this.backendUrl = config.backendUrl
        this.ensureStorageDir()
    }

    private ensureStorageDir(): void {
        if (!fs.existsSync(this.storageDir)) {
            fs.mkdirSync(this.storageDir, { recursive: true })
        }
    }

    private sanitizeKey(key: string): string {
        const sanitized = path.normalize(key).replace(/^(\.\.(\/|\\|$))+/, '')
        
        return sanitized.replace(/^[/\\]/, '')
    }

    private getFilePath(key: string): string {
        const sanitizedKey = this.sanitizeKey(key)
        
        return path.join(this.storageDir, sanitizedKey)
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
        
        return `${this.backendUrl}/api/static/uploads/${sanitizedKey}`
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

    public async check(): Promise<boolean> {
        const testFile = this.getFilePath('.storage_check')

        try {
            await fs.promises.writeFile(testFile, 'check')
            await fs.promises.unlink(testFile)
            return true
        } catch (error) {
            console.error('Error checking local storage:', error)
            return false
        }
    }
} 