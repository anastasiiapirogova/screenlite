import { prisma } from '@config/prisma.js'
import { UpdateFileData } from '../types.js'

export class FileRepository {
    static async getFileById(id: string | null) {
        if (!id) {
            return null
        }
        return await prisma.file.findUnique({
            where: { id },
        })
    }
    static async updateFile(id: string, data: Partial<UpdateFileData>) {
        return await prisma.file.update({
            where: { id },
            data,
        })
    }
    static async getFilesForFolderMove(fileIds?: string[]) {
        if (!fileIds || !fileIds.length) {
            return []
        }

        return await prisma.file.findMany({
            where: {
                id: {
                    in: fileIds
                },
            },
            select: {
                workspaceId: true,
                id: true,
                deletedAt: true,
            },
        })
    }
    static async updateFilesFolderId(fileIds: string[], folderId: string | null) {
        if(!fileIds.length) {
            return []
        }

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
