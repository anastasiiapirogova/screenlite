import { Request, Response } from 'express'
import { ResponseHandler } from '@/utils/ResponseHandler.js'
import { PlaylistRepository } from '../repositories/PlaylistRepository.js'

export const getPlaylistScreens = async (req: Request, res: Response) => {
    const { playlistId } = req.params

    const playlist = await PlaylistRepository.getWithScreens(playlistId)

    if (!playlist) {
        return ResponseHandler.notFound(req, res)
    }

    const screens = playlist?.screens.map(s => s.screen)

    ResponseHandler.json(res, {
        screens
    })
}
