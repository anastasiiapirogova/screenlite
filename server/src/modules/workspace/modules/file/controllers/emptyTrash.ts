import { Request, Response } from 'express'
import { prisma } from '@/config/prisma.ts'
import { ResponseHandler } from '@/utils/ResponseHandler.ts'

export const emptyTrash = async (req: Request, res: Response) => {
    const workspace = req.workspace!

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

        await tx.folder.deleteMany({
            where: {
                workspaceId: workspace.id,
                deletedAt: { not: null },
                parentId: null
            }
        })
    })

    return ResponseHandler.ok(res)
}