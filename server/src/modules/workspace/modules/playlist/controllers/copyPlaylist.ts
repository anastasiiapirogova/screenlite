import { Request, Response } from 'express'
import { ResponseHandler } from '@/utils/ResponseHandler.ts'
import { copyPlaylistSchema } from '../schemas/playlistSchemas.ts'
import { PlaylistCopyService } from '../services/PlaylistCopyService.ts'
import { PlaylistRepository } from '../repositories/PlaylistRepository.ts'

export const copyPlaylist = async (req: Request, res: Response) => {
    const { playlistId } = req.params

    const validation = await copyPlaylistSchema.safeParseAsync({
        playlistId
    })

    if (!validation.success) {
        return ResponseHandler.zodError(req, res, validation.error.errors)
    }

    const playlistToCopy = await PlaylistRepository.getPlaylistToCopy(playlistId)

    if (!playlistToCopy) {
        return ResponseHandler.notFound(req, res)
    }

    const playlist = await PlaylistCopyService.copyPlaylist(playlistToCopy)

    ResponseHandler.json(res, { playlist })
}
