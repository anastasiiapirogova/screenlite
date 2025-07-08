import { Request, Response } from 'express'
import { ResponseHandler } from '@/utils/ResponseHandler.ts'
import { PlaylistRepository } from '../repositories/PlaylistRepository.ts'
import { addScreensToPlaylistSchema } from '../schemas/playlistSchemas.ts'
import { addSendNewStateToDeviceJob } from '@/modules/device/utils/addSendNewStateToDeviceJob.ts'
import { ScreenRepository } from '@/modules/screen/repositories/ScreenRepository.ts'

export const addScreensToPlaylist = async (req: Request, res: Response) => {
    const validation = await addScreensToPlaylistSchema.safeParseAsync(req.body)

    if (!validation.success) {
        return ResponseHandler.zodError(req, res, validation.error.errors)
    }

    const { playlistId, screenIds } = validation.data

    const playlist = await PlaylistRepository.getPlaylistWithoutRelationsById(playlistId)

    if (!playlist) {
        return ResponseHandler.notFound(req, res)
    }

    if (playlist.deletedAt) {
        return ResponseHandler.validationError(req, res, {
            playlistId: 'PLAYLIST_IS_DELETED'
        })
    }

    if(playlist.type === PlaylistRepository.TYPE.NESTABLE) {
        return ResponseHandler.validationError(req, res, {
            playlistId: 'NESTABLE_PLAYLISTS_CANNOT_HAVE_SCREENS'
        })
    }

    const screens = await ScreenRepository.findManyByIdsAndWorkspaceId(screenIds, playlist.workspaceId)

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
