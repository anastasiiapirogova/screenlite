import { Request, Response } from 'express'
import { playlistPolicy } from './policies/playlistPolicy.js'
import { ResponseHandler } from '@utils/ResponseHandler.js'
import { PlaylistRepository } from './repositories/PlaylistRepository.js'

export const getPlaylistScreens = async (req: Request, res: Response) => {
    const user = req.user!
    const { id } = req.params

    const playlist = await PlaylistRepository.getWithScreens(id)

    if (!playlist) {
        return ResponseHandler.notFound(res)
    }

    const allowed = await playlistPolicy.canViewPlaylistScreens(user, playlist)

    if (!allowed) {
        return ResponseHandler.forbidden(res)
    }

    const screens = playlist?.screens.map(s => s.screen)

    ResponseHandler.json(res, {
        screens
    })
}
