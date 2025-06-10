import { Request, Response } from 'express'
import { ResponseHandler } from '@utils/ResponseHandler.js'
import { prisma } from '@config/prisma.js'
import { WORKSPACE_PERMISSIONS, WORKSPACE_ROLES, OWNER_ONLY_PERMISSIONS } from '@modules/workspace/constants/permissions.js'
import { WorkspacePermissionService } from '@modules/workspace/services/WorkspacePermissionService.js'
import { updateMemberSchema } from '../schemas/memberSchemas.js'
import type { WorkspacePermission } from '@modules/workspace/constants/permissions.js'

export const updateMember = async (req: Request, res: Response) => {
    const user = req.user!
    
    const validation = updateMemberSchema.safeParse(req.body)

    if (!validation.success) {
        return ResponseHandler.zodError(req, res, validation.error.errors)
    }

    const { workspaceId, userId, role, permissions } = validation.data

    const workspace = await prisma.workspace.findFirst({
        where: {
            id: workspaceId,
        },
        include: {
            members: {
                where: {
                    OR: [
                        { userId: user.id },
                        { userId: userId }
                    ]
                },
            },
        },
    })

    if (!workspace) {
        return ResponseHandler.notFound(res)
    }

    const currentUserMember = workspace.members.find(member => member.userId === user.id)
    const targetUserMember = workspace.members.find(member => member.userId === userId)

    if (!currentUserMember) {
        return ResponseHandler.forbidden(res)
    }

    if (!targetUserMember) {
        return ResponseHandler.validationError(req, res, {
            userId: 'USER_NOT_MEMBER',
        })
    }

    const { can } = WorkspacePermissionService.getUserWorkspacePermissions(currentUserMember)

    if (!can(WORKSPACE_PERMISSIONS.UPDATE_MEMBERS)) {
        return ResponseHandler.forbidden(res)
    }

    if (targetUserMember.role === WORKSPACE_ROLES.OWNER && currentUserMember.role !== WORKSPACE_ROLES.OWNER) {
        return ResponseHandler.validationError(req, res, {
            role: 'CANNOT_MODIFY_OWNER',
        })
    }

    if (role === WORKSPACE_ROLES.ADMIN) {
        if (!can(WORKSPACE_PERMISSIONS.ADD_ADMINS)) {
            return ResponseHandler.validationError(req, res, {
                role: 'CANNOT_SET_ADMIN_ROLE',
            })
        }
    }

    if (role && !Object.values(WORKSPACE_ROLES).includes(role)) {
        return ResponseHandler.validationError(req, res, {
            role: 'INVALID_ROLE',
        })
    }

    if (permissions) {
        const hasRestrictedPermissions = permissions.some(permission => 
            OWNER_ONLY_PERMISSIONS.includes(permission as typeof OWNER_ONLY_PERMISSIONS[number])
        )

        if (hasRestrictedPermissions) {
            return ResponseHandler.validationError(req, res, {
                permissions: 'RESTRICTED_PERMISSIONS_OWNER_ONLY',
            })
        }

        const hasAllPermissions = (permissions as WorkspacePermission[]).every(permission => 
            can(permission)
        )

        if (!hasAllPermissions) {
            return ResponseHandler.validationError(req, res, {
                permissions: 'CANNOT_GRANT_UNOWNED_PERMISSIONS',
            })
        }
    }

    const updatedMember = await prisma.userWorkspace.update({
        where: {
            userId_workspaceId: {
                userId: userId,
                workspaceId: workspaceId,
            },
        },
        data: {
            ...(role && { role }),
            ...(permissions && { permissions }),
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    createdAt: true,
                },
            },
        },
    })

    return ResponseHandler.json(res, {
        member: updatedMember,
    })
}
