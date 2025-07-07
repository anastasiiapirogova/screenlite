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

    // Since we can only force delete playlists that are already deleted,
    // there's no need to push a new state to the screens

    return ResponseHandler.ok(res)
}