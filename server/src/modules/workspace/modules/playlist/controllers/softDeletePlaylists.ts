import { Request, Response } from 'express'
import { prisma } from '@/config/prisma.ts'
import { ResponseHandler } from '@/utils/ResponseHandler.ts'
import { PlaylistRepository } from '../repositories/PlaylistRepository.ts'
import { addPlaylistUpdatedJobs } from '../utils/addPlaylistUpdatedJobs.ts'
import { deletePlaylistsSchema } from '../schemas/playlistSchemas.ts'

export const softDeletePlaylists = async (req: Request, res: Response) => {
    const user = req.user!

    const validation = await deletePlaylistsSchema.safeParseAsync(req.body)

    if (!validation.success) {
        return ResponseHandler.zodError(req, res, validation.error.errors)
    }

    const { playlistIds } = validation.data

    const playlists = await PlaylistRepository.findManyByIdEagerUser(playlistIds, user.id)

    if (playlists.length < 1) {
        return ResponseHandler.notFound(req, res)
    }

    const updatedPlaylists = await prisma.playlist.updateManyAndReturn({
        where: {
            id: {
                in: playlists.map(playlist => playlist.id)
            },
            isPublished: false,
            deletedAt: null
        },
        data: {
            deletedAt: new Date()
        },
        select: {
            id: true,
            isPublished: true,
        }
    })

    const updatedPlaylistIds = updatedPlaylists.map(playlist => playlist.id)

    const publishedPlaylistIds = updatedPlaylists
        .filter(playlist => playlist.isPublished)
        .map(playlist => playlist.id)

    // Only playlists that have been published are processed because draft playlists are not cached by devices,
    // so the device state won't change when an unpublished playlist is deleted.
    addPlaylistUpdatedJobs(publishedPlaylistIds, 'playlist soft deleted')

    ResponseHandler.json(res, {
        playlistIds: updatedPlaylistIds
    })
}
