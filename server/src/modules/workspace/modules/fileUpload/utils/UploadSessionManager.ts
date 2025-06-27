import { prisma } from '@/config/prisma.ts'
import { MultipartFileUploader } from '@/config/storage.ts'
import { FileUploadSession } from '@/generated/prisma/client.ts'

export class UploadSessionManager {
    static async updateSession(
        session: FileUploadSession,
        contentLength: bigint
    ): Promise<FileUploadSession> {
        return await prisma.$transaction(async (tx) => {
            const updatedSession = await tx.fileUploadSession.update({
                where: { id: session.id },
                data: {
                    uploaded: session.uploaded + contentLength,
                    uploadedParts: session.uploadedParts + 1,
                    completedAt: session.uploaded + contentLength === session.size ? new Date() : null,
                },
            })

            await MultipartFileUploader.confirmPartUpload(updatedSession, updatedSession.uploadedParts)

            return updatedSession
        })
    }
}