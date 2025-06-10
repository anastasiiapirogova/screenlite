import { Request, Response } from 'express'
import { playlistPolicy } from '../policies/playlistPolicy.js'
import { ResponseHandler } from '@utils/ResponseHandler.js'
import { PlaylistRepository } from '../repositories/PlaylistRepository.js'
import { asyncFilter } from '@utils/asyncFilter.js'
import { deletePlaylistsSchema } from '../schemas/playlistSchemas.js'

export const forceDeletePlaylists = async (req: Request, res: Response) => {
    const user = req.user!

    const validation = await deletePlaylistsSchema.safeParseAsync(req.body)

    if (!validation.success) {
        return ResponseHandler.zodError(req, res, validation.error.errors)
    }

    const { playlistIds } = validation.data

    const playlists = await PlaylistRepository.findManyDeletedByIdEagerUser(playlistIds, user.id)

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

    await PlaylistRepository.forceDeleteMany(allowedPlaylistIds)

    ResponseHandler.ok(res)
}
