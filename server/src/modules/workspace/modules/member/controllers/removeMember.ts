import { Request, Response } from 'express'
import { ResponseHandler } from '@utils/ResponseHandler.js'
import { prisma } from '@config/prisma.js'
import { MemberRepository } from '../repositories/MemberRepository.js'

const isRemovingSelf = (requesterId: string, targetId: string) => requesterId === targetId

export const removeMember = async (req: Request, res: Response) => {
    const workspace = req.workspace!
    const user = req.user!
    const { userId } = req.params

    if (isRemovingSelf(user.id, userId)) {
        return ResponseHandler.validationError(req, res, {
            userId: 'CANNOT_REMOVE_SELF',
        })
    }

    const member = await prisma.userWorkspace.findFirst({
        where: {
            workspaceId: workspace.id,
            userId,
        }
    })

    if (!member) {
        return ResponseHandler.validationError(req, res, {
            userId: 'USER_NOT_MEMBER',
        })
    }

    await MemberRepository.removeMember(workspace.id, userId)

    return ResponseHandler.ok(res)
}
