import { prisma } from '@/config/prisma.ts'
import { UpdateFileData } from '../types.ts'
import { v4 as uuid } from 'uuid'
import { File, FileUploadSession } from '@/generated/prisma/client.ts'

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

    static async updateFile(id: string, data: Partial<File>) {
        return await prisma.file.update({
            where: { id },
            data,
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

    static async createFileFromFileUploadSession(session: FileUploadSession) {
        const mimeType = session.mimeType
    
        let fileType: 'video' | 'image' | 'audio' | undefined
    
        if (mimeType.startsWith('video/')) {
            fileType = 'video'
        } else if (mimeType.startsWith('image/')) {
            fileType = 'image'
        } else if (mimeType.startsWith('audio/')) {
            fileType = 'audio'
        }
    
    
        const file = await prisma.file.create({
            data: {
                name: session.name,
                extension: session.path.split('.').pop() || '',
                size: session.size,
                mimeType: mimeType,
                workspaceId: session.workspaceId,
                folderId: session.folderId,
                uploaderId: session.userId,
                path: session.path,
                createdAt: new Date(),
                type: fileType || 'unknown',
                processingStatus: 'pending_complete_multipart_upload',
            }
        })
    
        return file
    }

    static async findPlaylistsByFileId(fileId: string) {
        const items = await prisma.playlistItem.findMany({
            where: { fileId },
            select: {
                playlist: {
                    select: {
                        id: true,
                        name: true,
                        isPublished: true,
                    }
                }
            },
            distinct: ['playlistId']
        })

        return items.map(item => item.playlist)
    }
}
