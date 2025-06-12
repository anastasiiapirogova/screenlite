import { Request, Response } from 'express'
import { prisma } from '@config/prisma.js'
import { z } from 'zod'
import { ResponseHandler } from '@utils/ResponseHandler.js'

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

    return ResponseHandler.ok(res)
}
