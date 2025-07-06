import { Request, Response } from 'express'
import { prisma } from '@/config/prisma.ts'
import { z } from 'zod'
import { ResponseHandler } from '@/utils/ResponseHandler.ts'

const requestSchema = z.object({
    playlistIds: z.array(z.string())
})

export const forceDeletePlaylists = async (req: Request, res: Response) => {
    const workspace = req.workspace!

    const result = requestSchema.safeParse(req.body)

    if (!result.success) {
        return ResponseHandler.zodError(req, res, result.error.errors)
    }

    const { playlistIds } = result.data

    await prisma.playlist.deleteMany({
        where: {
            id: { in: playlistIds },
            workspaceId: workspace.id,
            deletedAt: { not: null }
        }
    })

    // Since we can only force delete playlists that are already deleted,
    // there's no need to push a new state to the screens

    return ResponseHandler.ok(res)
}
