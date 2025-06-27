import { Request, Response } from 'express'
import { prisma } from '@/config/prisma.ts'
import { removeScreensFromPlaylistSchema } from '../schemas/playlistSchemas.ts'
import { ResponseHandler } from '@/utils/ResponseHandler.ts'
import { PlaylistRepository } from '../repositories/PlaylistRepository.ts'
import { addSendNewStateToDeviceJob } from '@/modules/device/utils/addSendNewStateToDeviceJob.ts'

export const removeScreensFromPlaylist = async (req: Request, res: Response) => {
    const validation = await removeScreensFromPlaylistSchema.safeParseAsync(req.body)

    if (!validation.success) {
        return ResponseHandler.zodError(req, res, validation.error.errors)
    }

    const { playlistId, screenIds } = validation.data

    const playlist = await PlaylistRepository.getPlaylistType(playlistId)

    if (!playlist) {
        return ResponseHandler.notFound(req, res)
    }

    const screens = await prisma.screen.findMany({
        where: {
            id: {
                in: screenIds
            },
            playlists: {
                some: {
                    playlistId
                }
            },
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

    const updatedPlaylist = await PlaylistRepository.removeScreens(playlistId, screensIds)
    
    const updatedPlaylistScreens = updatedPlaylist.screens.map(ps => ps.screen)
    
    screens.forEach(screen => {
        if (!screen.device) return
    
        addSendNewStateToDeviceJob(screen.device.token)
    })
    
    ResponseHandler.json(res, {
        screens: updatedPlaylistScreens
    })
}
