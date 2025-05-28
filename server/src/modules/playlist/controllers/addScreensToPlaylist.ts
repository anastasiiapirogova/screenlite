import { Request, Response } from 'express'
import { prisma } from '../../../config/prisma.js'
import { ResponseHandler } from '@utils/ResponseHandler.js'
import { playlistPolicy } from '../policies/playlistPolicy.js'
import { PlaylistRepository } from '../repositories/PlaylistRepository.js'
import { addScreensToPlaylistSchema } from '../schemas/playlistSchemas.js'
import { addSendNewStateToDeviceJob } from '@modules/device/utils/addSendNewStateToDeviceJob.js'

export const addScreensToPlaylist = async (req: Request, res: Response) => {
    const user = req.user!

    const validation = await addScreensToPlaylistSchema.safeParseAsync(req.body)

    if (!validation.success) {
        return ResponseHandler.zodError(req, res, validation.error.errors)
    }

    const { playlistId, screenIds } = validation.data

    const playlist = await PlaylistRepository.getPlaylistWithoutRelationsById(playlistId)

    if (!playlist) {
        return ResponseHandler.notFound(res)
    }

    const allowed = await playlistPolicy.canManagePlaylistScreens(user, playlist)

    if (!allowed) {
        return ResponseHandler.forbidden(res)
    }

    if(playlist.type === 'nestable') {
        return ResponseHandler.validationError(req, res, {
            playlistId: 'NESTABLE_PLAYLISTS_CANNOT_HAVE_SCREENS'
        })
    }

    const screens = await prisma.screen.findMany({
        where: {
            id: {
                in: screenIds
            },
            workspaceId: playlist.workspaceId
        },
        select: {
            id: true,
            device: {
                select: {
                    token: true
                }
            }
        }
    })

    const screensIds = screens.map(screen => screen.id)

    const updatedPlaylist = await PlaylistRepository.addScreens(playlistId, screensIds)

    const updatedPlaylistScreens = updatedPlaylist.screens.map(ps => ps.screen)

    if(playlist.isPublished && !playlist.deletedAt) {
        screens.forEach(screen => {
            if (!screen.device) return
    
            addSendNewStateToDeviceJob(screen.device.token)
        })
    }

    ResponseHandler.json(res, {
        screens: updatedPlaylistScreens
    })
}
