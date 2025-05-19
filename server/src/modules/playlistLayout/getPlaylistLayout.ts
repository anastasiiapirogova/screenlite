import { Request, Response } from 'express'
import { playlistLayoutPolicy } from './policies/playlistLayoutPolicy.js'
import { ResponseHandler } from '@utils/ResponseHandler.js'
import { PlaylistLayoutRepository } from './repositories/PlaylistLayoutRepository.js'

export const getPlaylistLayout = async (req: Request, res: Response) => {
    const user = req.user!
    const { id } = req.params

    const playlistLayout = await PlaylistLayoutRepository.find(id)

    if (!playlistLayout) {
        return ResponseHandler.notFound(res)
    }

    const allowed = await playlistLayoutPolicy.canViewPlaylistLayout(user, playlistLayout)

    if (!allowed) {
        return ResponseHandler.forbidden(res)
    }

    ResponseHandler.json(res, {
        playlistLayout
    })
}
