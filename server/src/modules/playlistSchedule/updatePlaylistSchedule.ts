import { Request, Response } from 'express'
import { prisma } from '../../config/prisma.js'
import { updateScheduleValidationSchema } from './validationSchemas/scheduleValidationSchemas.js'
import { ResponseHandler } from '@utils/ResponseHandler.js'
import { addPlaylistUpdatedJob } from '@modules/playlist/utils/addPlaylistUpdatedJob.js'
import { playlistPolicy } from '@modules/playlist/policies/playlistPolicy.js'

export const updatePlaylistSchedule = async (req: Request, res: Response) => {
    const user = req.user!

    const validation = await updateScheduleValidationSchema.safeParseAsync(req.body)

    if (!validation.success) {
        return ResponseHandler.zodError(req, res, validation.error.errors)
    }

    const { scheduleId, startAt, endAt, startTime, endTime, weekdays } = validation.data

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

    const allowed = await playlistPolicy.canUpdatePlaylistSchedule(user, schedule.playlist)

    if (!allowed) {
        return ResponseHandler.forbidden(res)
    }

    const updatedStartTime = startTime ?? (endTime ? '00:00' : null)
    const updatedEndTime = endTime ?? (startTime ? '23:59' : null)

    const updatedPlaylist = await prisma.playlist.update({
        where: {
            id: schedule.playlistId,
        },
        data: {
            schedules: {
                update: {
                    where: {
                        id: scheduleId,
                    },
                    data: {
                        startAt,
                        endAt,
                        startTime: updatedStartTime,
                        endTime: updatedEndTime,
                        weekdays,
                    }
                },
            },
        },
        select: {
            id: true,
            schedules: true,
            isPublished: true,
            deletedAt: true,
        },
    })

    addPlaylistUpdatedJob(updatedPlaylist.id)

    ResponseHandler.json(res, {
        schedules: updatedPlaylist.schedules
    })
}
