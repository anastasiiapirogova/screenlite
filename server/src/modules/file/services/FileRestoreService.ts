import { prisma } from '@/config/prisma.ts'
import { FileJobProducer } from '@/bullmq/producers/FileJobProducer.ts'

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
        if (!fileIds.length) {
            return { restoredFiles: [] }
        }

        const filesToRestore = await this.fetchFiles(fileIds, workspaceId)

        const deletedFiles: FetchedFile[] = []
        const undeletedFiles: FetchedFile[] = []
        const foundFileIds = new Set<string>()

        for (const f of filesToRestore) {
            foundFileIds.add(f.id)

            if (f.deletedAt !== null) {
                deletedFiles.push(f)
            } else {
                undeletedFiles.push(f)
            }
        }

        const notFoundFiles = fileIds.filter(id => !foundFileIds.has(id))

        if (!deletedFiles.length) {
            return {
                restoredFiles: [],
                alreadyRestoredFiles: undeletedFiles.length ? undeletedFiles.map(f => f.id) : undefined,
                notFoundFiles: notFoundFiles.length ? notFoundFiles : undefined
            }
        }

        let validFolderIds: Set<string> = new Set()

        if (deletedFiles.some(f => f.folderIdBeforeDeletion)) {
            validFolderIds = await this.getValidFolderIds(deletedFiles)
        }

        await this.restoreDeletedFiles(deletedFiles, validFolderIds)

        const restoredFileIds = deletedFiles.map(f => f.id)

        if (restoredFileIds.length) {
            await FileJobProducer.queueFileUpdatedJobs(restoredFileIds)
        }

        return {
            restoredFiles: restoredFileIds,
            alreadyRestoredFiles: undeletedFiles.length ? undeletedFiles.map(f => f.id) : undefined,
            notFoundFiles: notFoundFiles.length ? notFoundFiles : undefined
        }
    }

    private static async fetchFiles(fileIds: string[], workspaceId: string) {
        return prisma.file.findMany({
            where: {
                id: { in: fileIds },
                workspaceId,
                forceDeleteRequestedAt: null
            },
            select: {
                id: true,
                folderIdBeforeDeletion: true,
                deletedAt: true
            }
        })
    }

    private static async getValidFolderIds(files: { folderIdBeforeDeletion: string | null }[]) {
        const folderIds = []

        for (const f of files) {
            if (f.folderIdBeforeDeletion) folderIds.push(f.folderIdBeforeDeletion)
        }

        if (!folderIds.length) return new Set<string>()

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
        if (!files.length) return

        const updateOperations = files.map(file =>
            prisma.file.update({
                where: { id: file.id },
                data: {
                    deletedAt: null,
                    folderId: file.folderIdBeforeDeletion && validFolderIds.has(file.folderIdBeforeDeletion)
                        ? file.folderIdBeforeDeletion
                        : null,
                    folderIdBeforeDeletion: null,
                }
            })
        )

        await prisma.$transaction(updateOperations)
    }
}