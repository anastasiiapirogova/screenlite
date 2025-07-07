import { Request, Response } from 'express'
import { ResponseHandler } from '@/utils/ResponseHandler.ts'
import { PlaylistLayoutRepository } from '../repositories/PlaylistLayoutRepository.ts'

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
