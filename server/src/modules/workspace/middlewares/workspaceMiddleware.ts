import { NextFunction, Request, Response } from 'express'
import { WorkspaceRepository } from '@/modules/workspace/repositories/WorkspaceRepository.ts'
import { ResponseHandler } from '@/utils/ResponseHandler.ts'
import { PermissionService } from '@/modules/workspace/accessControl/services/PermissionService.ts'
import { WorkspaceRole } from '@/modules/member/types.ts'
import { exclude } from '@/utils/exclude.ts'

export const workspaceMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = req.user!
        const { workspaceId, workspaceSlug } = req.params

        if (!workspaceId && !workspaceSlug) {
            return ResponseHandler.notFound(req, res, 'WORKSPACE_NOT_FOUND')
        }

        const workspace = workspaceId
            ? await WorkspaceRepository.getWithMember(workspaceId, user.id)
            : await WorkspaceRepository.getBySlugWithMember(workspaceSlug, user.id)

        if (!workspace) {
            return ResponseHandler.notFound(req, res, 'WORKSPACE_NOT_FOUND')
        }

        if (workspace.deletedAt) {
            return ResponseHandler.notFound(req, res, 'WORKSPACE_DELETED')
        }

        const workspaceMember = workspace.members[0]

        if (!workspaceMember) {
            return ResponseHandler.forbidden(req, res, 'NOT_A_MEMBER_OF_WORKSPACE')
        }

        req.workspace = {
            ...exclude(workspace, ['members']),
            currentUserAccess: {
                role: workspaceMember.role,
                permissions: PermissionService.getPermissionsStatus(
                    workspaceMember.role as WorkspaceRole,
                    workspaceMember.permissions
                )
            }
        }

        next()
    } catch (error) {
        next(error)
    }
} 