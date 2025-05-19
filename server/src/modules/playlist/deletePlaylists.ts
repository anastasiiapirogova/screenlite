import { Request, Response } from 'express'
import { prisma } from '../../config/prisma.js'
import { z } from 'zod'
import { asyncFilter } from '../../utils/asyncFilter.js'
import { playlistPolicy } from './policies/playlistPolicy.js'
import { ResponseHandler } from '@utils/ResponseHandler.js'
import { PlaylistRepository } from './repositories/PlaylistRepository.js'
import { addPlaylistUpdatedJobs } from './utils/addPlaylistUpdatedJobs.js'

const schema = z.object({
    playlistIds: z.array(z.string().nonempty('PLAYLIST_ID_IS_REQUIRED')),
})

export const deletePlaylists = async (req: Request, res: Response) => {
    const user = req.user!

    const validation = await schema.safeParseAsync(req.body)

    if (!validation.success) {
        return ResponseHandler.zodError(req, res, validation.error.errors)
    }

    const { playlistIds } = validation.data

    const playlists = await PlaylistRepository.findManyByIdEagerUser(playlistIds, user.id)

    if (playlists.length < 1) {
        return ResponseHandler.notFound(res)
    }

    const allowedPlaylists = await asyncFilter(playlists, async (playlist) => {
        return await playlistPolicy.canDeletePlaylist(user, playlist, playlist.workspace.members)
    })

    if (allowedPlaylists.length === 0) {
        return ResponseHandler.forbidden(res)
    }

    const allowedPlaylistIds = allowedPlaylists.map(playlist => playlist.id)

    const updatedPlaylists = await prisma.playlist.updateManyAndReturn({
        where: {
            id: {
                in: allowedPlaylistIds
            },
            isPublished: false,
            deletedAt: null
        },
        data: {
            deletedAt: new Date()
        },
        select: {
            id: true,
        }
    })

    const updatedPlaylistIds = updatedPlaylists.map(playlist => playlist.id)

    const publishedPlaylistIds = allowedPlaylists
        .filter(playlist => playlist.isPublished)
        .map(playlist => playlist.id)

    // Only playlists that have been published are processed because draft playlists are not cached by devices,
    // so the device state won't change when an unpublished playlist is deleted.
    addPlaylistUpdatedJobs(publishedPlaylistIds)

    ResponseHandler.json(res, {
        playlistIds: updatedPlaylistIds
    })
}
