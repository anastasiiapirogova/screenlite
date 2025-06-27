import { Request, Response } from 'express'
import { prisma } from '@/config/prisma.ts'
import { ResponseHandler } from '@/utils/ResponseHandler.ts'

export const emptyTrash = async (req: Request, res: Response) => {
    const workspace = req.workspace!

    await prisma.playlist.deleteMany({
        where: {
            workspaceId: workspace.id,
            deletedAt: { not: null }
        }
    })

    return ResponseHandler.ok(res)
} 