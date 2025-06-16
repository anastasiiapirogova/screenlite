import { FileUploadSession } from '@generated/prisma/client.js'
import { Request } from 'express'
import { FileUploadRepository } from '../../fileUpload/repositories/FileUploadRepository.js'

export class UploadFilePartService {
    private static readonly MAX_SIZE = 100 * 1024 * 1024

    static async validateSession(sessionId: string, workspaceId: string, userId: string): Promise<FileUploadSession | null> {
        const fileUploadSession = await FileUploadRepository.getFileUploadSession(sessionId, workspaceId)

        if (!fileUploadSession) {
            return null
        }

        if (userId !== fileUploadSession.userId) {
            return null
        }

        if (fileUploadSession.uploaded === fileUploadSession.size) {
            return fileUploadSession
        }

        return fileUploadSession
    }

    static handleUpload(req: Request, fileUploadSession: FileUploadSession): Promise<{ success: boolean, error?: string, data?: Buffer }> {
        return new Promise((resolve) => {
            const uploadData: Buffer[] = []
            let totalSize = 0

            const handleDataChunk = (chunk: Buffer) => {
                totalSize += chunk.length

                if (totalSize > this.MAX_SIZE || BigInt(totalSize) + fileUploadSession.uploaded > BigInt(fileUploadSession.size)) {
                    req.destroy()
                    resolve({ success: false, error: 'File too large' })
                    return
                }

                uploadData.push(chunk)
            }

            const handleError = () => {
                resolve({ success: false, error: 'Error during file upload' })
            }

            const handleUploadCompletion = () => {
                if (totalSize > this.MAX_SIZE) {
                    resolve({ success: false, error: 'File too large' })
                    return
                }

                const data = Buffer.concat(uploadData)

                resolve({ success: true, data })
            }

            req.on('data', handleDataChunk)
            req.on('error', handleError)
            req.on('end', handleUploadCompletion)
        })
    }
} 