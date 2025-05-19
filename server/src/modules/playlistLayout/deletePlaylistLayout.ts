import { Request, Response } from 'express'
import { playlistLayoutPolicy } from './policies/playlistLayoutPolicy.js'
import { ResponseHandler } from '@utils/ResponseHandler.js'
import { PlaylistLayoutRepository } from './repositories/PlaylistLayoutRepository.js'
import { deletePlaylistLayoutSchema } from './schemas/playlistLayoutSchemas.js'
import { prisma } from '@config/prisma.js'
import { addPlaylistUpdatedJobs } from '@modules/playlist/utils/addPlaylistUpdatedJobs.js'

export const deletePlaylistLayout = async (req: Request, res: Response) => {
    const user = req.user!
    const validation = await deletePlaylistLayoutSchema.safeParseAsync(req.body)

    if (!validation.success) {
        return ResponseHandler.zodError(req, res, validation.error.errors)
    }

    const { playlistLayoutId } = validation.data

    const playlistLayout = await PlaylistLayoutRepository.getWithPlaylistIds(playlistLayoutId)

    if (!playlistLayout) {
        return ResponseHandler.notFound(res)
    }

    const allowed = await playlistLayoutPolicy.canDeletePlaylistLayout(user, playlistLayout)

    if (!allowed) {
        return ResponseHandler.forbidden(res)
    }

    await prisma.playlistLayout.delete({
        where: {
            id: playlistLayoutId
        }
    })

    addPlaylistUpdatedJobs(playlistLayout.playlists.map((p) => p.id))

    ResponseHandler.ok(res)
}
