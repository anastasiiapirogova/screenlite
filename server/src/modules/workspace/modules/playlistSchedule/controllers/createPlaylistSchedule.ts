import { Request, Response } from 'express'
import { createScheduleValidationSchema } from '../schemas/scheduleValidationSchemas.js'
import { ResponseHandler } from '@utils/ResponseHandler.js'
import { PlaylistRepository } from '@modules/workspace/modules/playlist/repositories/PlaylistRepository.js'
import { addPlaylistUpdatedJob } from '@modules/workspace/modules/playlist/utils/addPlaylistUpdatedJob.js'

export const createPlaylistSchedule = async (req: Request, res: Response) => {
    const workspace = req.workspace!
    const validation = await createScheduleValidationSchema.safeParseAsync(req.body)

    if (!validation.success) {
        return ResponseHandler.zodError(req, res, validation.error.errors)
    }

    const { playlistId, startAt, endAt, startTime, endTime, weekdays } = validation.data

    const playlist = await PlaylistRepository.getPlaylistType(playlistId, workspace.id)

    if (!playlist) {
        return ResponseHandler.notFound(res)
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

    if(updatedPlaylist.isPublished && !updatedPlaylist.deletedAt) {
        addPlaylistUpdatedJob({ playlistId: updatedPlaylist.id })
    }

    ResponseHandler.created(res, {
        schedules: updatedPlaylist.schedules
    })
}