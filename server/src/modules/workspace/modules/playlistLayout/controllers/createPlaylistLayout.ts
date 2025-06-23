import { Request, Response } from 'express'
import { ResponseHandler } from '@/utils/ResponseHandler.js'
import { createPlaylistLayoutSchema } from '../schemas/playlistLayoutSchemas.js'
import { PlaylistLayoutRepository } from '../repositories/PlaylistLayoutRepository.js'

export const createPlaylistLayout = async (req: Request, res: Response) => {
    const workspace = req.workspace!
    const validation = await createPlaylistLayoutSchema.safeParseAsync(req.body)

    if (!validation.success) {
        return ResponseHandler.zodError(req, res, validation.error.errors)
    }

    const { name, resolutionHeight, resolutionWidth } = validation.data

    const playlistLayout = await PlaylistLayoutRepository.createLayout({
        workspaceId: workspace.id,
        name,
        resolutionHeight,
        resolutionWidth
    })

    return ResponseHandler.created(res, {
        playlistLayout
    })
}