import { Request, Response } from 'express'
import { ResponseHandler } from '@utils/ResponseHandler.js'
import { PlaylistRepository } from '../repositories/PlaylistRepository.js'
import { updatePlaylistPlaylistLayoutSchema } from '../schemas/playlistSchemas.js'
import { PlaylistLayoutRepository } from '@modules/workspace/modules/playlistLayout/repositories/PlaylistLayoutRepository.js'
import { addPlaylistUpdatedJob } from '../utils/addPlaylistUpdatedJob.js'
import { addPlaylistItemsUpdatedJob } from '../utils/addPlaylistItemsUpdatedJob.js'

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
        
        addPlaylistItemsUpdatedJob(playlistId)
        addPlaylistUpdatedJob({ playlistId })

        ResponseHandler.json(res, {
            playlist: updatedPlaylist
        })
    } catch (error) {
        console.error('Error updating playlist layout:', error)
        return ResponseHandler.serverError(req, res)
    }
}