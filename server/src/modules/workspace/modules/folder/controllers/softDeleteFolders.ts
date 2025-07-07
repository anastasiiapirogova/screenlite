import { Request, Response } from 'express'
import { deleteFoldersSchema } from '../schemas/folderSchemas.ts'
import { ResponseHandler } from '@/utils/ResponseHandler.ts'
import { FolderRepository } from '../repositories/FolderRepository.ts'
import { prisma } from '@/config/prisma.ts'
import { Prisma } from '@/generated/prisma/client.ts'
import { addFileUpdatedJobs } from '@/modules/workspace/modules/file/utils/addFileUpdatedJobs.ts'

export const softDeleteFolders = async (req: Request, res: Response) => {
    const workspace = req.workspace!

    const validation = await deleteFoldersSchema.safeParseAsync(req.body)

    if (!validation.success) {
        return ResponseHandler.zodError(req, res, validation.error.errors)
    }

    const { folderIds } = validation.data

    const foldersToDelete = await FolderRepository.findActiveFoldersByIds(folderIds, workspace.id)

    if (!foldersToDelete.length) {
        return ResponseHandler.ok(res)
    }

    const workspaceIds = new Set(foldersToDelete.map(folder => folder.workspaceId))

    if (workspaceIds.size !== 1) {
        return ResponseHandler.validationError(req, res, {
            folderIds: 'FOLDERS_MUST_BELONG_TO_SAME_WORKSPACE'
        })
    }

    const subfolders = await FolderRepository.findUniqueSubfolderIdsByRootIds(folderIds)
    const allFolderIds = [...folderIds, ...subfolders.map(folder => folder.id)]

    const files = await prisma.file.findMany({
        where: {
            folderId: {
                in: allFolderIds
            },
            workspaceId: workspace.id,
            deletedAt: null
        },
        select: {
            id: true
        }
    })

    const fileIds = files.map(file => file.id)

    await prisma.$transaction(async (tx) => {
        const now = new Date()

        await tx.$executeRaw`
                UPDATE "Folder"
                SET "parentIdBeforeDeletion" = "parentId",
                    "parentId" = NULL,
                    "deletedAt" = ${now}
                WHERE "id" IN (${Prisma.join(folderIds)})
            `

        if (subfolders.length > 0) {
            await tx.folder.updateMany({
                where: {
                    id: {
                        in: subfolders.map(folder => folder.id)
                    }
                },
                data: {
                    deletedAt: now
                }
            })
        }

        if (fileIds.length > 0) {
            await tx.file.updateMany({
                where: {
                    id: {
                        in: fileIds
                    }
                },
                data: {
                    deletedAt: now
                }
            })
        }
    })

    if (fileIds.length > 0) {
        addFileUpdatedJobs(fileIds)
    }

    return ResponseHandler.ok(res, {
        deletedFolderIds: allFolderIds,
        deletedFileIds: fileIds
    })
}