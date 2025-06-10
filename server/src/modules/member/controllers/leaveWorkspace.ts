import { Request, Response } from 'express'
import { ResponseHandler } from '@utils/ResponseHandler.js'
import { prisma } from '@config/prisma.js'
import { MemberRepository } from '../repositories/MemberRepository.js'
import { leaveWorkspaceSchema } from '../schemas/memberSchemas.js'
import { WORKSPACE_ROLES } from '@modules/workspace/constants/permissions.js'

export const leaveWorkspace = async (req: Request, res: Response) => {
    const user = req.user!
    
    const validation = leaveWorkspaceSchema.safeParse(req.body)

    if (!validation.success) {
        return ResponseHandler.zodError(req, res, validation.error.errors)
    }

    const { workspaceId } = validation.data

    const workspace = await prisma.workspace.findFirst({
        where: {
            id: workspaceId,
        },
        include: {
            members: {
                where: {
                    userId: user.id,
                },
                select: {
                    role: true,
                },
            },
            _count: {
                select: {
                    members: true,
                },
            },
        },
    })

    if (!workspace) {
        return ResponseHandler.notFound(res)
    }

    if (workspace.members.length === 0) {
        return ResponseHandler.forbidden(res)
    }

    const isOwner = workspace.members[0].role === WORKSPACE_ROLES.OWNER

    if (isOwner && workspace._count.members === 1) {
        return ResponseHandler.validationError(req, res, {
            workspace: 'CANNOT_LEAVE_AS_LAST_OWNER',
        })
    }

    await MemberRepository.removeMember(workspace.id, user.id)

    return ResponseHandler.ok(res)
}
