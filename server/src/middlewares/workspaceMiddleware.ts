import { NextFunction, Request, Response } from 'express'
import { WorkspaceRepository } from '@modules/workspace/repositories/WorkspaceRepository.js'
import { ResponseHandler } from '@utils/ResponseHandler.js'
import { exclude } from '@utils/exclude.js'

export const workspaceMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = req.user!
        const { workspaceId, workspaceSlug } = req.params

        if (!workspaceId && !workspaceSlug) {
            return ResponseHandler.notFound(res, 'WORKSPACE_NOT_FOUND')
        }

        const workspace = workspaceId ? await WorkspaceRepository.getWithMember(workspaceId, user.id) : await WorkspaceRepository.findBySlugWithMember(workspaceSlug, user.id)

        if (!workspace) {
            return ResponseHandler.notFound(res, 'WORKSPACE_NOT_FOUND')
        }

        if (workspace.deletedAt) {
            return ResponseHandler.notFound(res, 'WORKSPACE_DELETED')
        }

        const workspaceMember = workspace.members.find(member => member.userId === user.id)

        if (!workspaceMember) {
            return ResponseHandler.forbidden(res, 'NOT_A_MEMBER_OF_WORKSPACE')
        }

        req.workspace = {
            ...exclude(workspace, ['members']),
            currentUserAccess: {
                role: workspaceMember.role,
                permissions: workspaceMember.permissions
            }
        }

        next()
    } catch (error) {
        next(error)
    }
} 