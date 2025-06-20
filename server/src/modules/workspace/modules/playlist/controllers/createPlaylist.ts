import { Request, Response } from 'express'
import { newPlaylistSchema } from '../schemas/playlistSchemas.js'
import { ResponseHandler } from '@utils/ResponseHandler.js'
import { WorkspaceRepository } from '@modules/workspace/repositories/WorkspaceRepository.js'
import { PlaylistRepository } from '../repositories/PlaylistRepository.js'

export const createPlaylist = async (req: Request, res: Response) => {
    const validation = await newPlaylistSchema.safeParseAsync(req.body)

    if (!validation.success) {
        return ResponseHandler.zodError(req, res, validation.error.errors)
    }

    const { workspaceId, name, type } = validation.data

    const workspace = await WorkspaceRepository.exists(workspaceId)

    if (!workspace) {
        return ResponseHandler.notFound(req, res)
    }

    const playlist = await PlaylistRepository.create({
        name,
        type,
        workspaceId,
    })

    ResponseHandler.created(res, { playlist })
}