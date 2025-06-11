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
    
    static async findFolder(folderId: string, workspaceId?: string) {
        return await prisma.folder.findFirst({
            where: {
                id: folderId,
                ...(workspaceId && { workspaceId }),
            },
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
    
    static async findActiveFoldersByIds(folderIds: string[], workspaceId?: string) {
        return await prisma.folder.findMany({
            where: {
                id: {
                    in: folderIds
                },
                deletedAt: null,
                ...(workspaceId && { workspaceId })
            },
            select: {
                id: true,
                workspaceId: true,
                deletedAt: true,
            }
        })
    }
    
    static async calculateFolderDepth(workspaceId: string, parentId: string | null): Promise<number> {
        if (!parentId) {
            return 0
        }

        const result = await prisma.$queryRaw<[{ depth: number }]>`
            WITH RECURSIVE folder_hierarchy AS (
              SELECT id, "parentId", 1 as depth
              FROM "Folder"
              WHERE id = ${parentId}
                AND "workspaceId" = ${workspaceId}
                AND "deletedAt" IS NULL
          
              UNION ALL
          
              SELECT f.id, f."parentId", fh.depth + 1
              FROM "Folder" f
              INNER JOIN folder_hierarchy fh ON f.id = fh."parentId"
              WHERE f."workspaceId" = ${workspaceId}
                AND f."deletedAt" IS NULL
            )
            SELECT MAX(depth) as depth
            FROM folder_hierarchy
        `

        return result[0]?.depth ?? 0
    }
    
    static async findMaxSubfolderDepth(folderId: string): Promise<number> {
        const result = await prisma.$queryRaw<[{ max_depth: number }]>`
            WITH RECURSIVE FolderTree AS (
                SELECT id, "parentId", 0 as depth
                FROM "Folder"
                WHERE id = ${folderId}

                UNION ALL

                SELECT f.id, f."parentId", ft.depth + 1
                FROM "Folder" f
                INNER JOIN FolderTree ft ON ft.id = f."parentId"
                WHERE f."deletedAt" IS NULL
            )
            SELECT MAX(depth) as max_depth
            FROM FolderTree;
        `

        return result[0]?.max_depth ?? 0
    }
}