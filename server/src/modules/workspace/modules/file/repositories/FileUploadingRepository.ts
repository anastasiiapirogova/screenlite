import { prisma } from '@config/prisma.js'

export class FileUploadingRepository {
    static async getFileUploadSession(sessionId: string, workspaceId?: string) {
        return await prisma.fileUploadSession.findUnique({
            where: {
                id: sessionId,
                ...(workspaceId && { workspaceId }),
            },
        })
    }
}