import { Request, Response } from 'express'
import { ResponseHandler } from '@/utils/ResponseHandler.ts'
import { fixOrderOfPlaylistItems } from '../utils/fixOrderOfPlaylistItems.ts'
import { PlaylistRepository } from '../repositories/PlaylistRepository.ts'

export const getPlaylistItems = async (req: Request, res: Response) => {
    const { playlistId } = req.params

    const playlist = await PlaylistRepository.getWithExtendedItems(playlistId)

    if (!playlist) {
        return ResponseHandler.notFound(req, res)
    }

    ResponseHandler.json(res, {
        items: fixOrderOfPlaylistItems(playlist.items)
    })
}
