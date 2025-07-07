import { Request, Response } from 'express'
import { ResponseHandler } from '@/utils/ResponseHandler.ts'
import { removeUndefinedFromObject } from '@/utils/removeUndefinedFromObject.ts'
import { PlaylistRepository } from '../repositories/PlaylistRepository.ts'
import { updatePlaylistSchema } from '../schemas/playlistSchemas.ts'
import { addPlaylistUpdatedJob } from '../utils/addPlaylistUpdatedJob.ts'
import { getModifiedPlaylistFields } from '../utils/getModifiedPlaylistFields.ts'

const doesUpdateAffectScreens = (deletedAt: Date | null, updatedFields: Record<string, unknown>) => {
    if(deletedAt) return false

    return Object.keys(updatedFields).some(key => key === 'isPublished' || key === 'priority')
}

export const updatePlaylist = async (req: Request, res: Response) => {
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
        return ResponseHandler.notFound(req, res)
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
        addPlaylistUpdatedJob({ playlistId: playlist.id, context: 'playlist metadata updated' })
    }

    ResponseHandler.json(res, {
        playlist: updatedPlaylist
    })
}
