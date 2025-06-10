import { Request, Response } from 'express'
import { ResponseHandler } from '@utils/ResponseHandler.js'
import { WorkspaceRepository } from '../repositories/WorkspaceRepository.js'
import { WorkspacePermissionService } from '../services/WorkspacePermissionService.js'
import { WORKSPACE_PERMISSIONS, WorkspacePermission } from '../constants/permissions.js'

export const getWorkspaceEntityCounts = async (req: Request, res: Response) => {
    const workspace = req.workspace!
    const can = (permission: WorkspacePermission) => WorkspacePermissionService.can(workspace.permissions, permission)

    const entityCounts = await WorkspaceRepository.getEntityCounts(workspace.id)
    const screenStatusCount = await WorkspaceRepository.getScreenStatusCount(workspace.id)

    const filteredCounts = {
        members: can(WORKSPACE_PERMISSIONS.VIEW_MEMBERS) ? entityCounts.members : undefined,
        playlists: can(WORKSPACE_PERMISSIONS.VIEW_PLAYLISTS) ? entityCounts.playlists : undefined,
        screens: can(WORKSPACE_PERMISSIONS.VIEW_SCREENS) ? entityCounts.screens : undefined,
        layouts: can(WORKSPACE_PERMISSIONS.VIEW_PLAYLISTS) ? entityCounts.layouts : undefined,
        files: can(WORKSPACE_PERMISSIONS.VIEW_FILES) ? entityCounts.files : undefined,
        invitations: can(WORKSPACE_PERMISSIONS.VIEW_INVITATIONS) ? entityCounts.invitations : undefined,
        screenStatus: can(WORKSPACE_PERMISSIONS.VIEW_SCREENS) ? screenStatusCount : undefined,
    }

    return ResponseHandler.json(res, {
        workspaceEntityCounts: filteredCounts
    })
}
