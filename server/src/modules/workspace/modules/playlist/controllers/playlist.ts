import { Request, Response } from 'express'
import { ResponseHandler } from '@utils/ResponseHandler.js'
import { PlaylistRepository } from '../repositories/PlaylistRepository.js'

export const playlist = async (req: Request, res: Response) => {
    const { playlistId } = req.params
    const workspace = req.workspace!

    const playlist = await PlaylistRepository.getPlaylist(playlistId, workspace.id)

    if (!playlist) {
        return ResponseHandler.notFound(res)
    }

    ResponseHandler.json(res, {
        playlist
    })
}
