import { Request, Response } from 'express'
import { prisma } from '@config/prisma.js'
import { z } from 'zod'
import { ResponseHandler } from '@utils/ResponseHandler.js'

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

    await prisma.folder.deleteMany({
        where: {
            id: { in: folderIds },
            workspaceId: workspace.id,
            deletedAt: { not: null },
            parentId: null
        }
    })

    return ResponseHandler.ok(res)
} 