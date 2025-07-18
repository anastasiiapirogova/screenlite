import { MultipartFileUploader } from '@/core/ports/multipart-file-upload.interface.ts'
import { MultipartUpload } from '@/core/entities/multipart-upload.entity.ts'
import { Readable } from 'stream'
import * as fs from 'fs/promises'
import * as path from 'path'
import { createReadStream, createWriteStream } from 'fs'

export class LocalMultipartFileUploadAdapter implements MultipartFileUploader {
    constructor(
        private readonly uploadsDir: string,
        private readonly multipartUploadsDir: string
    ) {}

    private async ensureDirectoryExists(dirPath: string): Promise<void> {
        await fs.mkdir(dirPath, { recursive: true })
    }

    private getUploadDir(uploadId: string): string {
        return path.join(this.multipartUploadsDir, uploadId)
    }

    private getPartFilePath(uploadId: string, partNumber: number): string {
        return path.join(this.getUploadDir(uploadId), `part-${partNumber}`)
    }

    private getFinalFilePath(filePath: string): string {
        return path.join(this.uploadsDir, filePath)
    }

    async initializeUpload(upload: MultipartUpload): Promise<void> {
        let uniqueId: string
        let uploadDir: string

        do {
            uniqueId = `${Date.now()}-${Math.random().toString(36).substring(2, 10)}`
            uploadDir = this.getUploadDir(uniqueId)
        } while (await fs.stat(uploadDir).then(() => true).catch(() => false))

        upload.setUploadId(uniqueId)

        const uploadDirFinal = this.getUploadDir(upload.uploadId)

        await this.ensureDirectoryExists(uploadDirFinal)
    }

    async uploadPart(
        upload: MultipartUpload,
        stream: Readable,
        partNumber: number
    ): Promise<void> {
        const partPath = this.getPartFilePath(upload.uploadId, partNumber)

        await this.ensureDirectoryExists(path.dirname(partPath))

        return new Promise((resolve, reject) => {
            const writeStream = createWriteStream(partPath)

            stream
                .pipe(writeStream)
                .on('finish', resolve)
                .on('error', reject)
        })
    }

    async completeUpload(upload: MultipartUpload): Promise<void> {
        const uploadDir = this.getUploadDir(upload.uploadId)
        const finalPath = this.getFinalFilePath(upload.path)
    
        await this.ensureDirectoryExists(path.dirname(finalPath))
    
        await this.mergeParts(uploadDir, finalPath)
    
        await fs.rm(uploadDir, { recursive: true, force: true })
    }

    async abortUpload(upload: MultipartUpload): Promise<void> {
        const uploadDir = this.getUploadDir(upload.uploadId)

        await fs.rm(uploadDir, { recursive: true, force: true })
    }

    private async mergeParts(sourceDir: string, destination: string): Promise<void> {
        const files = await fs.readdir(sourceDir)
        const sortedFiles = files
            .filter(f => f.startsWith('part-'))
            .sort((a, b) => {
                const aNum = parseInt(a.split('-')[1])
                const bNum = parseInt(b.split('-')[1])

                return aNum - bNum
            })

        const writeStream = createWriteStream(destination)
    
        for (const file of sortedFiles) {
            const filePath = path.join(sourceDir, file)
            const readStream = createReadStream(filePath)
      
            await new Promise<void>((resolve, reject) => {
                readStream.pipe(writeStream, { end: false })
                readStream.on('end', () => resolve())
                readStream.on('error', reject)
            })
        }
        
        writeStream.end()
    }
}