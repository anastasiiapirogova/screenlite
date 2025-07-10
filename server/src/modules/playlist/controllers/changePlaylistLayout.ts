import { Request, Response } from 'express'
import { ResponseHandler } from '@/utils/ResponseHandler.ts'
import { PlaylistRepository } from '../repositories/PlaylistRepository.ts'
import { updatePlaylistPlaylistLayoutSchema } from '../schemas/playlistSchemas.ts'
import { PlaylistLayoutRepository } from '@/modules/playlistLayout/repositories/PlaylistLayoutRepository.ts'

import { PlaylistJobProducer } from '@/bullmq/producers/PlaylistJobProducer.ts'

export const changePlaylistLayout = async (req: Request, res: Response) => {
    const data = req.body

    const validation = await updatePlaylistPlaylistLayoutSchema.safeParseAsync(data)

    if (!validation.success) {
        return ResponseHandler.zodError(req, res, validation.error.errors)
    }

    const {
        playlistId,
        playlistLayoutId
    } = validation.data

    const playlist = await PlaylistRepository.getPlaylist(playlistId)

    if (!playlist) {
        return ResponseHandler.notFound(req, res)
    }

    if (playlist.deletedAt) {
        return ResponseHandler.validationError(req, res, {
            playlistId: 'PLAYLIST_IS_DELETED'
        })
    }

    const layoutExists = await PlaylistLayoutRepository.existsInWorkspace(playlistLayoutId, playlist.workspaceId)

    if(!layoutExists) {
        return ResponseHandler.validationError(req, res, {
            playlistLayoutId: 'PLAYLIST_LAYOUT_NOT_FOUND'
        })
    }

    if(playlist.playlistLayoutId === playlistLayoutId) {
        return ResponseHandler.json(res, {
            playlist
        })
    }

    try {
        const updatedPlaylist = await PlaylistRepository.updateLayoutPreservingItems(playlistId, playlistLayoutId)
        
        await PlaylistJobProducer.queueRecalculatePlaylistSizeJob(playlistId)
        await PlaylistJobProducer.queuePlaylistUpdatedJob(playlistId, 'playlist layout changed')

        ResponseHandler.json(res, {
            playlist: updatedPlaylist
        })
    } catch (error) {
        console.error('Error updating playlist layout:', error)
        return ResponseHandler.serverError(req, res)
    }
}