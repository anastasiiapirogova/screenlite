import { Request, Response } from 'express'
import { prisma } from '@/config/prisma.js'
import { ResponseHandler } from '@/utils/ResponseHandler.js'

export const getPlaylistLayoutPlaylists = async (req: Request, res: Response) => {
    const { playlistLayoutId } = req.params

    const playlistLayout = await prisma.playlistLayout.findUnique({
        where: {
            id: playlistLayoutId,
        },
        select: {
            workspaceId: true,
            playlists: {
                where: {
                    deletedAt: null
                }
            }
        },
    })

    if (!playlistLayout) {
        return ResponseHandler.notFound(req, res)
    }

    return ResponseHandler.json(res, {
        playlists: playlistLayout.playlists
    })
}
