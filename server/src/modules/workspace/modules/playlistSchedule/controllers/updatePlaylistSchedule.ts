import { Request, Response } from 'express'
import { prisma } from '@/config/prisma.js'
import { updateScheduleValidationSchema } from '../schemas/scheduleValidationSchemas.js'
import { ResponseHandler } from '@/utils/ResponseHandler.js'
import { addPlaylistUpdatedJob } from '@/modules/workspace/modules/playlist/utils/addPlaylistUpdatedJob.js'

export const updatePlaylistSchedule = async (req: Request, res: Response) => {
    const workspace = req.workspace!
    const validation = await updateScheduleValidationSchema.safeParseAsync(req.body)

    if (!validation.success) {
        return ResponseHandler.zodError(req, res, validation.error.errors)
    }

    const { scheduleId, startAt, endAt, startTime, endTime, weekdays } = validation.data

    const schedule = await prisma.playlistSchedule.findUnique({
        where: {
            id: scheduleId,
            playlist: {
                workspaceId: workspace.id
            }
        },
        include: {
            playlist: true
        }
    })

    if (!schedule) {
        return ResponseHandler.notFound(req, res)
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

    if(updatedPlaylist.isPublished && !updatedPlaylist.deletedAt) {
        addPlaylistUpdatedJob({ playlistId: updatedPlaylist.id })
    }

    ResponseHandler.json(res, {
        schedules: updatedPlaylist.schedules
    })
}
