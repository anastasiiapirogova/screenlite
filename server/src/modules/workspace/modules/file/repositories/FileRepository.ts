import { prisma } from '@config/prisma.js'
import { UpdateFileData } from '../types.js'

export class FileRepository {
    static async findById(id: string, workspaceId?: string) {
        return await prisma.file.findUnique({
            where: {
                id,
                ...(workspaceId && { workspaceId })
            },
        })
    }

    static async updateFileProperties(id: string, data: Partial<UpdateFileData>) {
        return await prisma.file.update({
            where: { id },
            data,
        })
    }

    static async findActiveFilesByIds(fileIds: string[], workspaceId?: string) {
        return await prisma.file.findMany({
            where: {
                id: {
                    in: fileIds
                },
                deletedAt: null,
                ...(workspaceId && { workspaceId })
            },
            select: {
                id: true,
                workspaceId: true,
                deletedAt: true,
            },
        })
    }

    static async moveFilesToFolder(fileIds: string[], folderId: string | null) {
        return await prisma.file.updateManyAndReturn({
            where: {
                id: {
                    in: fileIds
                }
            },
            data: { folderId },
        })
    }
}
