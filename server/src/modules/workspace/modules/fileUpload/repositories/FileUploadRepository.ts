import { prisma } from '@config/prisma.js'
import { CreateFileUploadSessionData } from '../types.js'
import { FileUploadSession } from '@generated/prisma/client.js'

export class FileUploadRepository {
    static isUploaded(session: FileUploadSession) {
        return session.uploaded === session.size
    }

    static isCompleted(session: FileUploadSession) {
        return this.isUploaded(session) && session.completedAt !== null
    }

    static async createFileUploadSession(data: CreateFileUploadSessionData) {
        return await prisma.fileUploadSession.create({
            data,
        })
    }

    static async getFileUploadSession(fileUploadSessionId: string, workspaceId?: string) {
        return await prisma.fileUploadSession.findUnique({
            where: {
                id: fileUploadSessionId,
                ...(workspaceId && { workspaceId }),
            },
        })
    }

    static async setUploadId(fileUploadSessionId: string, uploadId: string) {
        return await prisma.fileUploadSession.update({
            where: {
                id: fileUploadSessionId,
            },
            data: { uploadId },
        })
    }

    static async addUploadedData(fileUploadSession: FileUploadSession, receivedBytes: number) {
        return await prisma.fileUploadSession.update({
            where: {
                id: fileUploadSession.id,
            },
            data: {
                uploaded: fileUploadSession.uploaded + BigInt(receivedBytes),
                uploadedParts: fileUploadSession.uploadedParts + 1,
                completedAt: fileUploadSession.uploaded + BigInt(receivedBytes) === fileUploadSession.size ? new Date() : null,
            },
        })
    }

    static async updateFileUploadSession(id: string, data: Partial<FileUploadSession>) {
        return await prisma.fileUploadSession.update({
            where: {
                id,
            },
            data,
        })
    }

    static async deleteFileUploadSession(id: string) {
        return await prisma.fileUploadSession.delete({
            where: {
                id,
            },
        })
    }
}