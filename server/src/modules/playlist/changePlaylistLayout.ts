import { Request, Response } from 'express'
import { playlistPolicy } from './policies/playlistPolicy.js'
import { ResponseHandler } from '@utils/ResponseHandler.js'
import { PlaylistRepository } from './repositories/PlaylistRepository.js'
import { updatePlaylistPlaylistLayoutSchema } from './schemas/playlistSchemas.js'
import { PlaylistLayoutRepository } from '@modules/playlistLayout/repositories/PlaylistLayoutRepository.js'
import { addPlaylistUpdatedJob } from './utils/addPlaylistUpdatedJob.js'

// TODO: When changing the layout, it might be better to avoid deleting all playlist items. 
// Instead, we could retain items that have a layout section name matching a section in the 
// new layout and associate these items with their corresponding sections. Only items with 
// no matching section in the new layout should be deleted. This would allow users to change 
// the layout without losing all their playlist items.
export const changePlaylistLayout = async (req: Request, res: Response) => {
    const user = req.user!
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
        return ResponseHandler.notFound(res)
    }

    const allowed = await playlistPolicy.canUpdatePlaylist(user, playlist)

    if (!allowed) {
        return ResponseHandler.forbidden(res)
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

    const updatedPlaylist = await PlaylistRepository.updateLayout(playlistId, playlistLayoutId)

    addPlaylistUpdatedJob(playlistId)

    ResponseHandler.json(res, {
        playlist: updatedPlaylist
    })
}