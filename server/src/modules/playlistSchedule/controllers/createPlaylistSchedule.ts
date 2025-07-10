import { Request, Response } from 'express'
import { createScheduleValidationSchema } from '../schemas/scheduleValidationSchemas.ts'
import { ResponseHandler } from '@/utils/ResponseHandler.ts'
import { PlaylistRepository } from '@/modules/playlist/repositories/PlaylistRepository.ts'
import { PlaylistJobProducer } from '@/bullmq/producers/PlaylistJobProducer.ts'

export const createPlaylistSchedule = async (req: Request, res: Response) => {
    const workspace = req.workspace!
    const validation = await createScheduleValidationSchema.safeParseAsync(req.body)

    if (!validation.success) {
        return ResponseHandler.zodError(req, res, validation.error.errors)
    }

    const { playlistId, startAt, endAt, startTime, endTime, weekdays } = validation.data

    const playlist = await PlaylistRepository.getPlaylistType(playlistId, workspace.id)

    if (!playlist) {
        return ResponseHandler.notFound(req, res)
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
        await PlaylistJobProducer.queuePlaylistUpdatedJob(updatedPlaylist.id, 'playlist schedule created')
    }

    ResponseHandler.created(res, {
        schedules: updatedPlaylist.schedules
    })
}