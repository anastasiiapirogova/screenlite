import { Request, Response } from 'express'
import { ResponseHandler } from '@/utils/ResponseHandler.ts'
import { WorkspaceRepository } from '../repositories/WorkspaceRepository.ts'

export const getWorkspaceEntityCounts = async (req: Request, res: Response) => {
    const workspace = req.workspace!

    const entityCounts = await WorkspaceRepository.getEntityCounts(workspace.id)
    const screenStatusCount = await WorkspaceRepository.getScreenStatusCount(workspace.id)

    const filteredCounts = {
        members: entityCounts.members,
        playlists: entityCounts.playlists,
        screens: entityCounts.screens,
        layouts: entityCounts.layouts,
        files: entityCounts.files,
        trashedFiles: entityCounts.trashedFiles,
        invitations: entityCounts.invitations,
        screenStatus: screenStatusCount,
    }

    return ResponseHandler.json(res, {
        workspaceEntityCounts: filteredCounts
    })
}
