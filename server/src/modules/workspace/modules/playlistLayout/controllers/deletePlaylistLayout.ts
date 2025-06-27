import { Request, Response } from 'express'
import { ResponseHandler } from '@/utils/ResponseHandler.ts'
import { PlaylistLayoutRepository } from '../repositories/PlaylistLayoutRepository.ts'
import { prisma } from '@/config/prisma.ts'
import { addPlaylistUpdatedJobs } from '@/modules/workspace/modules/playlist/utils/addPlaylistUpdatedJobs.ts'

export const deletePlaylistLayout = async (req: Request, res: Response) => {
    const { playlistLayoutId } = req.params

    const playlistLayout = await PlaylistLayoutRepository.getWithPlaylistIds(playlistLayoutId)

    if (!playlistLayout) {
        return ResponseHandler.notFound(req, res)
    }

    await prisma.playlistLayout.delete({
        where: {
            id: playlistLayoutId
        }
    })

    addPlaylistUpdatedJobs(playlistLayout.playlists.map((p) => p.id))

    return ResponseHandler.ok(res)
}
