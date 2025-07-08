import { Request, Response } from 'express'
import { ResponseHandler } from '@/utils/ResponseHandler.ts'
import { PlaylistRepository } from '../repositories/PlaylistRepository.ts'

export const getPlaylistItems = async (req: Request, res: Response) => {
    const { id: workspaceId } = req.workspace!
    const { playlistId } = req.params

    const playlist = await PlaylistRepository.getWithExtendedItems(playlistId, workspaceId)

    if (!playlist) {
        return ResponseHandler.notFound(req, res)
    }

    if (playlist.deletedAt) {
        return ResponseHandler.validationError(req, res, {
            playlistId: 'PLAYLIST_IS_DELETED'
        })
    }

    ResponseHandler.json(res, {
        items: PlaylistRepository.orderItems(playlist.items)
    })
}
