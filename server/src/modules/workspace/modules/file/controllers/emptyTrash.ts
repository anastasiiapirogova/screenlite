import { Request, Response } from 'express'
import { prisma } from '@/config/prisma.ts'
import { ResponseHandler } from '@/utils/ResponseHandler.ts'
import { addFileForceDeletedJobs } from '../utils/addFileForceDeletedJobs.ts'

export const emptyTrash = async (req: Request, res: Response) => {
    const workspace = req.workspace!

    const filesToDelete = await prisma.file.findMany({
        where: {
            workspaceId: workspace.id,
            deletedAt: { not: null },
        },
        select: {
            id: true
        }
    })

    const fileIds = filesToDelete.map(file => file.id)

    await prisma.$transaction(async (tx) => {
        // TODO: For large numbers of files, implement batch processing here to avoid long-running transactions
        await tx.file.updateMany({
            where: {
                workspaceId: workspace.id,
                deletedAt: { not: null },
            },
            data: {
                forceDeleteRequestedAt: new Date(),
                folderId: null,
                folderIdBeforeDeletion: null,
            }
        })

        await tx.playlistItem.deleteMany({
            where: {
                fileId: {
                    in: fileIds
                }
            }
        })

        await tx.folder.deleteMany({
            where: {
                workspaceId: workspace.id,
                deletedAt: { not: null },
                parentId: null
            }
        })
    })

    if (fileIds.length > 0) {
        addFileForceDeletedJobs(fileIds)
    }

    return ResponseHandler.ok(res, {
        forceDeletedFileIds: fileIds
    })
}