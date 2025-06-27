import { Request, Response } from 'express'
import { ResponseHandler } from '@/utils/ResponseHandler.ts'
import { PlaylistRepository } from '../repositories/PlaylistRepository.ts'

export const playlist = async (req: Request, res: Response) => {
    const { playlistId } = req.params
    const workspace = req.workspace!

    const playlist = await PlaylistRepository.getPlaylist(playlistId, workspace.id)

    if (!playlist) {
        return ResponseHandler.notFound(req, res)
    }

    ResponseHandler.json(res, {
        playlist
    })
}
