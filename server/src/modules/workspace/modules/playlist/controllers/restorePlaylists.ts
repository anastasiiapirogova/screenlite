import { Request, Response } from 'express'
import { prisma } from '@config/prisma.js'
import { ResponseHandler } from '@utils/ResponseHandler.js'
import { addPlaylistUpdatedJob } from '../utils/addPlaylistUpdatedJob.js'
import { PlaylistRepository } from '../repositories/PlaylistRepository.js'
import { restorePlaylistsSchema } from '../schemas/playlistSchemas.js'

export const restorePlaylists = async (req: Request, res: Response) => {
    const user = req.user!

    const validation = await restorePlaylistsSchema.safeParseAsync(req.body)

    if (!validation.success) {
        return ResponseHandler.zodError(req, res, validation.error.errors)
    }

    const { playlistIds } = validation.data

    const playlists = await PlaylistRepository.findManyByIdEagerUser(playlistIds, user.id)

    if (!playlists.length) {
        return ResponseHandler.notFound(req, res)
    }

    const updatedPlaylists = await prisma.playlist.updateManyAndReturn({
        where: {
            id: {
                in: playlists.map(playlist => playlist.id)
            },
            deletedAt: {
                not: null
            }
        },
        data: {
            deletedAt: null
        },
        select: {
            id: true,
            isPublished: true
        }
    })

    const updatedPlaylistIds = updatedPlaylists.map(playlist => playlist.id)

    const publishedPlaylistIds = updatedPlaylists
        .filter(playlist => playlist.isPublished)
        .map(playlist => playlist.id)

    for (const id of publishedPlaylistIds) {
        addPlaylistUpdatedJob({ playlistId: id })
    }

    ResponseHandler.json(res, {
        playlistIds: updatedPlaylistIds
    })
}
