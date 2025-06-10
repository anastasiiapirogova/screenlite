import { Request, Response } from 'express'
import { prisma } from '../../../config/prisma.js'
import { z } from 'zod'
import { ResponseHandler } from '@utils/ResponseHandler.js'
import { addPlaylistUpdatedJob } from '@modules/playlist/utils/addPlaylistUpdatedJob.js'
import { playlistPolicy } from '@modules/playlist/policies/playlistPolicy.js'
import { PlaylistRepository } from '@modules/playlist/repositories/PlaylistRepository.js'

const deleteScheduleSchema = z.object({
    scheduleId: z.string().nonempty('SCHEDULE_ID_IS_REQUIRED'),
})

export const deletePlaylistSchedule = async (req: Request, res: Response) => {
    const user = req.user!

    const validation = await deleteScheduleSchema.safeParseAsync(req.body)

    if (!validation.success) {
        return ResponseHandler.zodError(req, res, validation.error.errors)
    }

    const { scheduleId } = validation.data

    const schedule = await prisma.playlistSchedule.findUnique({
        where: {
            id: scheduleId,
        },
        include: {
            playlist: true
        }
    })

    if (!schedule) {
        return ResponseHandler.notFound(res)
    }

    const allowed = await playlistPolicy.canDeletePlaylistSchedule(user, schedule.playlist)

    if (!allowed) {
        return ResponseHandler.forbidden(res)
    }

    const updatedPlaylist = await PlaylistRepository.deleteSchedule(schedule.playlistId, scheduleId)

    if(updatedPlaylist.isPublished && !updatedPlaylist.deletedAt) {
        addPlaylistUpdatedJob({ playlistId: updatedPlaylist.id })
    }

    ResponseHandler.json(res, {
        schedules: updatedPlaylist.schedules
    })
}
