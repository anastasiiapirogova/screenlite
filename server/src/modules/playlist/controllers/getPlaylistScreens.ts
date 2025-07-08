import { Request, Response } from 'express'
import { ResponseHandler } from '@/utils/ResponseHandler.ts'
import { PlaylistRepository } from '../repositories/PlaylistRepository.ts'

export const getPlaylistScreens = async (req: Request, res: Response) => {
    const { playlistId } = req.params
    const { id: workspaceId } = req.workspace!

    const playlist = await PlaylistRepository.getWithScreens(playlistId, workspaceId)

    if (!playlist) {
        return ResponseHandler.notFound(req, res)
    }

    if (playlist.deletedAt) {
        return ResponseHandler.validationError(req, res, {
            playlistId: 'PLAYLIST_IS_DELETED'
        })
    }

    const screens = playlist?.screens.map(s => s.screen)

    ResponseHandler.json(res, {
        screens
    })
}
