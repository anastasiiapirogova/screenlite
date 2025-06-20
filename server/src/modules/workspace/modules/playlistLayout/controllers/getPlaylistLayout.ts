import { Request, Response } from 'express'
import { ResponseHandler } from '@utils/ResponseHandler.js'
import { PlaylistLayoutRepository } from '../repositories/PlaylistLayoutRepository.js'

export const getPlaylistLayout = async (req: Request, res: Response) => {
    const { playlistLayoutId } = req.params

    const playlistLayout = await PlaylistLayoutRepository.find(playlistLayoutId)

    if (!playlistLayout) {
        return ResponseHandler.notFound(req, res)
    }

    return ResponseHandler.json(res, {
        playlistLayout
    })
}
