import { Request, Response } from 'express'
import { prisma } from '@/config/prisma.ts'
import { ResponseHandler } from '@/utils/ResponseHandler.ts'
import { PlaylistJobProducer } from '@/bullmq/producers/PlaylistJobProducer.ts'
import { PlaylistRepository } from '@/modules/playlist/repositories/PlaylistRepository.ts'
import { deleteScheduleSchema } from '../schemas/scheduleValidationSchemas.ts'

export const deletePlaylistSchedule = async (req: Request, res: Response) => {
    const workspace = req.workspace!
    const validation = await deleteScheduleSchema.safeParseAsync(req.body)

    if (!validation.success) {
        return ResponseHandler.zodError(req, res, validation.error.errors)
    }

    const { scheduleId } = validation.data

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

    const updatedPlaylist = await PlaylistRepository.deleteSchedule(schedule.playlistId, scheduleId)

    if(updatedPlaylist.isPublished && !updatedPlaylist.deletedAt) {
        await PlaylistJobProducer.queuePlaylistUpdatedJob(updatedPlaylist.id, 'playlist schedule deleted')
    }

    ResponseHandler.json(res, {
        schedules: updatedPlaylist.schedules
    })
}
