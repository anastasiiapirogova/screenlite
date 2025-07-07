import { Request, Response } from 'express'
import { prisma } from '@/config/prisma.ts'
import { z } from 'zod'
import { ResponseHandler } from '@/utils/ResponseHandler.ts'
import { addFileForceDeletedJobs } from '@/modules/workspace/modules/file/utils/addFileForceDeletedJobs.ts'
import { FolderRepository } from '../repositories/FolderRepository.ts'

const requestSchema = z.object({
    folderIds: z.array(z.string())
})  

export const forceDeleteFolders = async (req: Request, res: Response) => {
    const workspace = req.workspace!

    const result = requestSchema.safeParse(req.body)

    if (!result.success) {
        return ResponseHandler.zodError(req, res, result.error.errors)
    }

    const { folderIds } = result.data

    const nestedSubfolders = await FolderRepository.findUniqueSubfolderIdsByRootIds(folderIds)
    const allFolderIds = [...folderIds, ...nestedSubfolders.map(folder => folder.id)]

    const filesToDelete = await prisma.file.findMany({
        where: {
            folderId: {
                in: allFolderIds
            },
            workspaceId: workspace.id,
            deletedAt: { not: null }
        },
        select: {
            id: true
        }
    })

    const fileIds = filesToDelete.map(file => file.id)

    await prisma.$transaction(async (tx) => {
        await tx.file.updateMany({
            where: {
                id: { in: fileIds }
            },
            data: {
                forceDeleteRequestedAt: new Date(),
                folderId: null,
                folderIdBeforeDeletion: null,
            }
        })

        await tx.folder.deleteMany({
            where: {
                id: { in: allFolderIds },
                workspaceId: workspace.id,
                deletedAt: { not: null },
            }
        })

        await tx.playlistItem.deleteMany({
            where: {
                fileId: {
                    in: fileIds
                }
            }
        })
    })

    if (fileIds.length > 0) {
        addFileForceDeletedJobs(fileIds)
    }

    return ResponseHandler.ok(res, {
        forceDeletedFolderIds: allFolderIds,
        forceDeletedFileIds: fileIds
    })
} 