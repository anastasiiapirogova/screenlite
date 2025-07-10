import { Request, Response } from 'express'
import { prisma } from '@/config/prisma.ts'
import { ResponseHandler } from '@/utils/ResponseHandler.ts'
import { PlaylistJobProducer } from '@/bullmq/producers/PlaylistJobProducer.ts'
import { PlaylistRepository } from '../repositories/PlaylistRepository.ts'
import { restorePlaylistsSchema } from '../schemas/playlistSchemas.ts'

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
        await PlaylistJobProducer.queuePlaylistUpdatedJob(id, 'playlist restored')
    }

    ResponseHandler.json(res, {
        playlistIds: updatedPlaylistIds
    })
}
