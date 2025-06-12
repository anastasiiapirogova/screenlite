import { prisma } from '@config/prisma.js'
import { FolderRepository } from '../repositories/FolderRepository.js'

type RestoreFoldersResult = {
    restoredFolders: string[]
    alreadyRestoredFolders?: string[]
    notFoundFolders?: string[]
}

type FetchedFolder = {
    id: string
    parentIdBeforeDeletion: string | null
    deletedAt: Date | null
}

export class FolderRestoreService {
    static async restoreFolders(folderIds: string[], workspaceId: string): Promise<RestoreFoldersResult> {
        const foldersToProcess = await this.fetchFolders(folderIds, workspaceId)
        
        const { deletedFolders, undeletedFolders, notFoundFolders } = this.categorizeFolders(foldersToProcess, folderIds)

        if (deletedFolders.length === 0) {
            return {
                restoredFolders: [],
                alreadyRestoredFolders: undeletedFolders.length > 0 ? undeletedFolders.map(f => f.id) : undefined,
                notFoundFolders: notFoundFolders.length > 0 ? notFoundFolders : undefined
            }
        }

        const validParentIds = await this.getValidParentIds(deletedFolders)
        
        await this.restoreDeletedFolders(deletedFolders, validParentIds)

        return {
            restoredFolders: deletedFolders.map(f => f.id),
            alreadyRestoredFolders: undeletedFolders.length > 0 ? undeletedFolders.map(f => f.id) : undefined,
            notFoundFolders: notFoundFolders.length > 0 ? notFoundFolders : undefined
        }
    }

    private static async fetchFolders(folderIds: string[], workspaceId: string) {
        return prisma.folder.findMany({
            where: {
                id: { in: folderIds },
                workspaceId
            },
            select: {
                id: true,
                parentIdBeforeDeletion: true,
                deletedAt: true
            }
        })
    }

    private static categorizeFolders(folders: FetchedFolder[], folderIds: string[]) {
        const deletedFolders = folders.filter(f => f.deletedAt !== null)
        const undeletedFolders = folders.filter(f => f.deletedAt === null)
        const foundFolderIds = new Set(folders.map(f => f.id))
        const notFoundFolders = folderIds.filter(id => !foundFolderIds.has(id))

        return { deletedFolders, undeletedFolders, notFoundFolders }
    }

    private static async getValidParentIds(folders: { parentIdBeforeDeletion: string | null }[]) {
        const parentIds = folders
            .map(f => f.parentIdBeforeDeletion)
            .filter((id): id is string => id !== null)

        if (parentIds.length === 0) return new Set<string>()

        const existingFolders = await prisma.folder.findMany({
            where: {
                id: { in: parentIds },
                deletedAt: null
            },
            select: { id: true }
        })

        return new Set(existingFolders.map(f => f.id))
    }

    private static async restoreDeletedFolders(folders: FetchedFolder[], validParentIds: Set<string>) {
        const rootFoldersData = folders.map(folder => ({
            id: folder.id,
            parentId: folder.parentIdBeforeDeletion && validParentIds.has(folder.parentIdBeforeDeletion)
                ? folder.parentIdBeforeDeletion
                : null,
            parentIdBeforeDeletion: null,
            deletedAt: null
        }))

        const subfolders = await FolderRepository.findUniqueSubfolderIdsByRootIds(rootFoldersData.map(folder => folder.id))

        const filesToRestore = await prisma.file.findMany({
            where: {
                folderId: { in: [...rootFoldersData.map(folder => folder.id), ...subfolders.map(subfolder => subfolder.id)] },
                deletedAt: { not: null }
            }
        })

        await prisma.$transaction([
            ...rootFoldersData.map(folder => prisma.folder.update({
                where: { id: folder.id },
                data: { deletedAt: null, parentId: folder.parentId, parentIdBeforeDeletion: null }
            })),
            ...subfolders.map(subfolder => prisma.folder.update({
                where: { id: subfolder.id },
                data: { deletedAt: null, parentId: subfolder.parentId, parentIdBeforeDeletion: null }
            })),
            ...filesToRestore.map(file => prisma.file.update({
                where: { id: file.id },
                data: { deletedAt: null, folderIdBeforeDeletion: null }
            }))
        ])
    }
} 