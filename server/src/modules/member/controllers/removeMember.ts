import { Request, Response } from 'express'
import { ResponseHandler } from '@utils/ResponseHandler.js'
import { prisma } from '@config/prisma.js'
import { MemberRepository } from '../repositories/MemberRepository.js'
import { removeMemberSchema } from '../schemas/memberSchemas.js'
import { memberPolicy } from '../policies/memberPolicy.js'

export const removeMember = async (req: Request, res: Response) => {
    const user = req.user!
    
    const validation = removeMemberSchema.safeParse(req.body)

    if (!validation.success) {
        return ResponseHandler.zodError(req, res, validation.error.errors)
    }

    const { workspaceId, userId } = validation.data

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

    const { allowed, error } = await memberPolicy.canRemoveMember(
        currentUserMember,
        targetUserMember,
        workspace._count.members
    )

    if (!allowed) {
        if (error) {
            return ResponseHandler.validationError(req, res, {
                userId: error,
            })
        }
        return ResponseHandler.forbidden(res)
    }

    await MemberRepository.removeMember(workspaceId, userId)

    return ResponseHandler.ok(res)
} 