import { Request, Response } from 'express'
import { playlistPolicy } from '../policies/playlistPolicy.js'
import { ResponseHandler } from '@utils/ResponseHandler.js'
import { fixOrderOfPlaylistItems } from '../utils/fixOrderOfPlaylistItems.js'
import { PlaylistRepository } from '../repositories/PlaylistRepository.js'

export const getPlaylistItems = async (req: Request, res: Response) => {
    const user = req.user!
    const { id } = req.params

    const playlist = await PlaylistRepository.getWithExtendedItems(id)

    if (!playlist) {
        return ResponseHandler.notFound(res)
    }

    const allowed = await playlistPolicy.canViewPlaylist(user, playlist)

    if (!allowed) {
        return ResponseHandler.forbidden(res)
    }

    ResponseHandler.json(res, {
        items: fixOrderOfPlaylistItems(playlist.items)
    })
}
