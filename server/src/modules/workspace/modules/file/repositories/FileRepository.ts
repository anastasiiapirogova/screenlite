import { prisma } from '@config/prisma.js'
import { UpdateFileData } from '../types.js'
import { v4 as uuid } from 'uuid'

export class FileRepository {
    static async createFileKey(workspaceId: string, filename: string) {
        const uniqueFilename = await this.generateUniqueFileName(filename)

        const key = `workspaces/${workspaceId}/${uniqueFilename}`

        return key
    }

    static async generateUniqueFileName(filename: string) {
        const extension = filename.split('.').pop() || ''

        const id = uuid()

        return `${id}.${extension}`
    }

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
