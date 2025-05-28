import { Request, Response } from 'express'
import { prisma } from '../../../config/prisma.js'
import { ResponseHandler } from '@utils/ResponseHandler.js'
import { playlistPolicy } from '@modules/playlist/policies/playlistPolicy.js'

export const getPlaylistLayoutPlaylists = async (req: Request, res: Response) => {
    const user = req.user!
    const { id } = req.params

    const playlistLayout = await prisma.playlistLayout.findUnique({
        where: {
            id: id,
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
        return ResponseHandler.notFound(res)
    }

    const allowed = await playlistPolicy.canViewPlaylists(user, playlistLayout.workspaceId)

    if (!allowed) {
        return ResponseHandler.forbidden(res)
    }

    ResponseHandler.json(res, {
        playlists: playlistLayout.playlists
    })
}
