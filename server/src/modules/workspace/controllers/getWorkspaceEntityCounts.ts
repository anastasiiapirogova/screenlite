import { Request, Response } from 'express'
import { ResponseHandler } from '@/utils/ResponseHandler.js'
import { WorkspaceRepository } from '../repositories/WorkspaceRepository.js'

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
        invitations: entityCounts.invitations,
        screenStatus: screenStatusCount,
    }

    return ResponseHandler.json(res, {
        workspaceEntityCounts: filteredCounts
    })
}
