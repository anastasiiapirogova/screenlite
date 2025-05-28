import { Request, Response } from 'express'
import { playlistPolicy } from '../policies/playlistPolicy.js'
import { ResponseHandler } from '@utils/ResponseHandler.js'
import { removeUndefinedFromObject } from '@utils/removeUndefinedFromObject.js'
import { PlaylistRepository } from '../repositories/PlaylistRepository.js'
import { updatePlaylistSchema } from '../schemas/playlistSchemas.js'
import { addPlaylistUpdatedJob } from '../utils/addPlaylistUpdatedJob.js'
import { getModifiedPlaylistFields } from '../utils/get.js'

const doesUpdateAffectScreens = (deletedAt: Date | null, updatedFields: Record<string, unknown>) => {
    if(deletedAt) return false

    return Object.keys(updatedFields).some(key => key === 'isPublished' || key === 'priority')
}

export const updatePlaylist = async (req: Request, res: Response) => {
    const user = req.user!
    const data = req.body

    const validation = await updatePlaylistSchema.safeParseAsync(data)

    if (!validation.success) {
        return ResponseHandler.zodError(req, res, validation.error.errors)
    }

    const {
        playlistId,
        priority,
        description,
        isPublished,
        name,
    } = validation.data

    const playlist = await PlaylistRepository.getPlaylist(playlistId)

    if (!playlist) {
        return ResponseHandler.notFound(res)
    }

    const allowed = await playlistPolicy.canUpdatePlaylist(user, playlist)

    if (!allowed) {
        return ResponseHandler.forbidden(res)
    }

    const updatedFields = removeUndefinedFromObject({
        priority,
        description,
        isPublished,
        name,
    })
    
    const modifiedFields = getModifiedPlaylistFields(playlist, updatedFields)

    if(Object.keys(modifiedFields).length === 0) {
        const refetchedPlaylist = await PlaylistRepository.getPlaylist(playlistId)

        return ResponseHandler.json(res, {
            playlist: refetchedPlaylist
        })
    }

    const updatedPlaylist = await PlaylistRepository.update(playlistId, modifiedFields)

    if(doesUpdateAffectScreens(playlist.deletedAt, modifiedFields)) {
        addPlaylistUpdatedJob(playlist.id)
    }

    ResponseHandler.json(res, {
        playlist: updatedPlaylist
    })
}
