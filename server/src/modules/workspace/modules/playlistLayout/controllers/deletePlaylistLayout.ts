import { Request, Response } from 'express'
import { ResponseHandler } from '@utils/ResponseHandler.js'
import { PlaylistLayoutRepository } from '../repositories/PlaylistLayoutRepository.js'
import { prisma } from '@config/prisma.js'
import { addPlaylistUpdatedJobs } from '@modules/workspace/modules/playlist/utils/addPlaylistUpdatedJobs.js'

export const deletePlaylistLayout = async (req: Request, res: Response) => {
    const { playlistLayoutId } = req.params

    const playlistLayout = await PlaylistLayoutRepository.getWithPlaylistIds(playlistLayoutId)

    if (!playlistLayout) {
        return ResponseHandler.notFound(res)
    }

    await prisma.playlistLayout.delete({
        where: {
            id: playlistLayoutId
        }
    })

    addPlaylistUpdatedJobs(playlistLayout.playlists.map((p) => p.id))

    return ResponseHandler.ok(res)
}
