import { prisma } from '@/config/prisma.ts'

type RestoreFilesResult = {
    restoredFiles: string[]
    alreadyRestoredFiles?: string[]
    notFoundFiles?: string[]
}

type FetchedFile = {
    id: string
    folderIdBeforeDeletion: string | null
    deletedAt: Date | null
}

export class FileRestoreService {
    static async restoreFiles(fileIds: string[], workspaceId: string): Promise<RestoreFilesResult> {
        const filesToRestore = await this.fetchFiles(fileIds, workspaceId)

        const { deletedFiles, undeletedFiles, notFoundFiles } = this.categorizeFiles(filesToRestore, fileIds)

        if (deletedFiles.length === 0) {
            return {
                restoredFiles: [],
                alreadyRestoredFiles: undeletedFiles.length > 0 ? undeletedFiles.map(f => f.id) : undefined,
                notFoundFiles: notFoundFiles.length > 0 ? notFoundFiles : undefined
            }
        }

        const validFolderIds = await this.getValidFolderIds(deletedFiles)

        await this.restoreDeletedFiles(deletedFiles, validFolderIds)

        return {
            restoredFiles: deletedFiles.map(f => f.id),
            alreadyRestoredFiles: undeletedFiles.length > 0 ? undeletedFiles.map(f => f.id) : undefined,
            notFoundFiles: notFoundFiles.length > 0 ? notFoundFiles : undefined
        }
    }

    private static async fetchFiles(fileIds: string[], workspaceId: string) {
        return prisma.file.findMany({
            where: {
                id: { in: fileIds },
                workspaceId
            },
            select: {
                id: true,
                folderIdBeforeDeletion: true,
                deletedAt: true
            }
        })
    }

    private static categorizeFiles(files: FetchedFile[], fileIds: string[]) {
        const deletedFiles = files.filter(f => f.deletedAt !== null)
        const undeletedFiles = files.filter(f => f.deletedAt === null)
        const foundFileIds = new Set(files.map(f => f.id))
        const notFoundFiles = fileIds.filter(id => !foundFileIds.has(id))

        return { deletedFiles, undeletedFiles, notFoundFiles }
    }

    private static async getValidFolderIds(files: { folderIdBeforeDeletion: string | null }[]) {
        const folderIds = files
            .map(f => f.folderIdBeforeDeletion)
            .filter((id): id is string => id !== null)

        if (folderIds.length === 0) return new Set<string>()

        const existingFolders = await prisma.folder.findMany({
            where: {
                id: { in: folderIds },
                deletedAt: null
            },
            select: { id: true }
        })

        return new Set(existingFolders.map(f => f.id))
    }

    private static async restoreDeletedFiles(files: FetchedFile[], validFolderIds: Set<string>) {
        const updateOperations = files.map(file =>
            prisma.file.update({
                where: { id: file.id },
                data: {
                    deletedAt: null,
                    folderId: file.folderIdBeforeDeletion && validFolderIds.has(file.folderIdBeforeDeletion)
                        ? file.folderIdBeforeDeletion
                        : null,
                    folderIdBeforeDeletion: null
                }
            })
        )
    
        await prisma.$transaction(updateOperations)
    }
}
