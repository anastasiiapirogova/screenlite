import { Request, Response } from 'express'
import { createScheduleValidationSchema } from './validationSchemas/scheduleValidationSchemas.js'
import { ResponseHandler } from '@utils/ResponseHandler.js'
import { PlaylistRepository } from '@modules/playlist/repositories/PlaylistRepository.js'
import { addPlaylistUpdatedJob } from '@modules/playlist/utils/addPlaylistUpdatedJob.js'
import { playlistPolicy } from '@modules/playlist/policies/playlistPolicy.js'

export const createPlaylistSchedule = async (req: Request, res: Response) => {
    const user = req.user!

    const validation = await createScheduleValidationSchema.safeParseAsync(req.body)

    if (!validation.success) {
        return ResponseHandler.zodError(req, res, validation.error.errors)
    }

    const { playlistId, startAt, endAt, startTime, endTime, weekdays } = validation.data

    const playlist = await PlaylistRepository.getPlaylistType(playlistId)

    if (!playlist) {
        return ResponseHandler.notFound(res)
    }

    const allowed = await playlistPolicy.canCreatePlaylistSchedule(user, playlist)

    if (!allowed) {
        return ResponseHandler.forbidden(res)
    }

    if(playlist.type === 'nestable') {
        return ResponseHandler.validationError(req, res, {
            playlistId: 'NESTABLE_PLAYLISTS_CANNOT_HAVE_SCHEDULES'
        })
    }

    const updatedStartTime = startTime ?? (endTime ? '00:00' : null)
    const updatedEndTime = endTime ?? (startTime ? '23:59' : null)

    const updatedPlaylist = await PlaylistRepository.createSchedule(playlistId, {
        startAt,
        endAt,
        startTime: updatedStartTime,
        endTime: updatedEndTime,
        weekdays,
    })

    addPlaylistUpdatedJob(updatedPlaylist.id)

    ResponseHandler.created(res, {
        schedules: updatedPlaylist.schedules
    })
}