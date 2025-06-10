import { prisma } from '@config/prisma.js'
import { CreateFolderData, FolderTreeResult, ParentFolderTreeResult, UpdateFolderData } from '../types.js'

export class FolderRepository {
    static async createFolder(data: CreateFolderData) {
        return await prisma.folder.create({
            data
        })
    }
    static async updateFolder(id: string, data: Partial<UpdateFolderData>) {
        return await prisma.folder.update({
            where: { id },
            data,
        })
    }
    static async getFolderById(id: string) {
        return await prisma.folder.findUnique({
            where: { id },
        })
    }
    static async deleteFolder(id: string) {
        return await prisma.folder.delete({
            where: { id },
        })
    }
    static async findFoldersByIdsWithWorkspace(folderIds: string[]) {
        return await prisma.folder.findMany({
            where: {
                id: {
                    in: folderIds
                },
            },
            select: {
                workspaceId: true,
                id: true,
                deletedAt: true,
            },
        })
    }
    static async updateFoldersParent(folderIds: string[], parentId: string | null) {
        return await prisma.folder.updateManyAndReturn({
            where: {
                id: {
                    in: folderIds
                }
            },
            data: { parentId },
        })
    }
    static async findFolderSubtreeById(folderId: string): Promise<FolderTreeResult[]> {
        return await prisma.$queryRaw`
            WITH RECURSIVE FolderTree AS (
                SELECT id, "parentId"
                FROM "Folder"
                WHERE id = ${folderId}

                UNION ALL

                SELECT f.id, f."parentId"
                FROM "Folder" f
                INNER JOIN FolderTree ft ON f."parentId" = ft.id
            )
            SELECT * FROM FolderTree
            WHERE id != ${folderId};
        `
    }
    static async findFolderAncestorsById(folderId: string): Promise<ParentFolderTreeResult[]> {
        return await prisma.$queryRaw`
            WITH RECURSIVE ParentTree AS (
                SELECT "id", "name", "parentId"
                FROM "Folder"
                WHERE "id" = ${folderId}

                UNION ALL

                SELECT f."id", f."name", f."parentId"
                FROM "Folder" f
                INNER JOIN ParentTree pt ON f."id" = pt."parentId"
            )
            SELECT * FROM ParentTree
            WHERE id != ${folderId};
        `
    }
    static async findActiveFoldersByIds(folderIds: string[]) {
        return await prisma.folder.findMany({
            where: {
                id: {
                    in: folderIds
                },
                deletedAt: null
            },
            select: {
                id: true,
                workspaceId: true
            }
        })
    }
}