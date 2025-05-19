import { Request, Response } from 'express'
import { z } from 'zod'
import { playlistPolicy } from './policies/playlistPolicy.js'
import { ResponseHandler } from '@utils/ResponseHandler.js'
import { PlaylistRepository } from './repositories/PlaylistRepository.js'
import { asyncFilter } from '@utils/asyncFilter.js'

const schema = z.object({
    playlistIds: z.array(z.string().nonempty('PLAYLIST_ID_IS_REQUIRED')),
})

export const forceDeletePlaylists = async (req: Request, res: Response) => {
    const user = req.user!

    const validation = await schema.safeParseAsync(req.body)

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
