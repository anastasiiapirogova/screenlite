import { Request, Response } from 'express'
import { prisma } from '@/config/prisma.js'
import { ResponseHandler } from '@/utils/ResponseHandler.js'
import { addPlaylistUpdatedJob } from '@/modules/workspace/modules/playlist/utils/addPlaylistUpdatedJob.js'
import { PlaylistRepository } from '@/modules/workspace/modules/playlist/repositories/PlaylistRepository.js'
import { deleteScheduleSchema } from '../schemas/scheduleValidationSchemas.js'

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
        addPlaylistUpdatedJob({ playlistId: updatedPlaylist.id })
    }

    ResponseHandler.json(res, {
        schedules: updatedPlaylist.schedules
    })
}
