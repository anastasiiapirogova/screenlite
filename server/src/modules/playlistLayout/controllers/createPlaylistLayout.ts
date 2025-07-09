import { Request, Response } from 'express'
import { ResponseHandler } from '@/utils/ResponseHandler.ts'
import { createPlaylistLayoutSchema } from '../schemas/playlistLayoutSchemas.ts'
import { PlaylistLayoutRepository } from '../repositories/PlaylistLayoutRepository.ts'
import { WorkspaceService } from '@workspaceModules/utils/WorkspaceService.ts'

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

    await WorkspaceService.invalidateWorkspaceEntityCounts(workspace.id)

    return ResponseHandler.created(res, {
        playlistLayout
    })
}