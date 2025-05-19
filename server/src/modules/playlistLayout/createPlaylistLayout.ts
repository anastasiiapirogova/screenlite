import { Request, Response } from 'express'
import { ResponseHandler } from '@utils/ResponseHandler.js'
import { createPlaylistLayoutSchema } from './schemas/playlistLayoutSchemas.js'
import { playlistLayoutPolicy } from './policies/playlistLayoutPolicy.js'
import { PlaylistLayoutRepository } from './repositories/PlaylistLayoutRepository.js'
import { WorkspaceRepository } from '@modules/workspace/repositories/WorkspaceRepository.js'

export const createPlaylistLayout = async (req: Request, res: Response) => {
    const user = req.user!

    const validation = await createPlaylistLayoutSchema.safeParseAsync(req.body)

    if (!validation.success) {
        ResponseHandler.zodError(req, res, validation.error.errors)
        return
    }

    const { workspaceId, name, resolutionHeight, resolutionWidth } = validation.data

    const workspaceExists = await WorkspaceRepository.exists(workspaceId)

    if (!workspaceExists) {
        return ResponseHandler.notFound(res)
    }

    const allowed = await playlistLayoutPolicy.canCreatePlaylistLayouts(user, workspaceId)

    if (!allowed) {
        return ResponseHandler.forbidden(res)
    }

    const playlistLayout = await PlaylistLayoutRepository.createLayout({
        workspaceId,
        name,
        resolutionHeight,
        resolutionWidth
    })

    ResponseHandler.created(res, {
        playlistLayout
    })
}