import { Request, Response } from 'express'
import { ResponseHandler } from '@utils/ResponseHandler.js'
import { WorkspacePolicy } from '../policies/WorkspacePolicy.js'
import { WorkspaceRepository } from '../repositories/WorkspaceRepository.js'

// TODO: Maybe hide some of the counts if the user has no access to them?
export const getWorkspaceEntityCounts = async (req: Request, res: Response) => {
    const user = req.user!
    const { slug } = req.params

    const workspace = await WorkspaceRepository.findBySlug(slug)

    if (!workspace) {
        return ResponseHandler.notFound(res)
    }

    const allowed = await WorkspacePolicy.canViewWorkspace(user, workspace)

    if (!allowed) {
        return ResponseHandler.forbidden(res)
    }

    const entityCounts = await WorkspaceRepository.getEntityCounts(workspace.id)
    const screenStatusCount = await WorkspaceRepository.getScreenStatusCount(workspace.id)

    return ResponseHandler.json(res, {
        workspaceEntityCounts: {
            ...entityCounts,
            screenStatus: screenStatusCount,
        }
    })
}
