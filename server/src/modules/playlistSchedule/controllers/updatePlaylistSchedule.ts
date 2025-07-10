import { Request, Response } from 'express'
import { prisma } from '@/config/prisma.ts'
import { updateScheduleValidationSchema } from '../schemas/scheduleValidationSchemas.ts'
import { ResponseHandler } from '@/utils/ResponseHandler.ts'
import { PlaylistJobProducer } from '@/bullmq/producers/PlaylistJobProducer.ts'

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
        await PlaylistJobProducer.queuePlaylistUpdatedJob(updatedPlaylist.id, 'playlist schedule updated')
    }

    ResponseHandler.json(res, {
        schedules: updatedPlaylist.schedules
    })
}
