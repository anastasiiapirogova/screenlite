import { Request, Response } from 'express'
import { prisma } from '@/config/prisma.ts'
import { ResponseHandler } from '@/utils/ResponseHandler.ts'
import { userInvitationsSchema } from '../schemas/workspaceUserInvitationSchemas.ts'
import { WorkspaceUserInvitationRepository } from '../repositories/WorkspaceUserInvitationRepository.ts'

export const userInvitations = async (req: Request, res: Response) => {
    const currentUser = req.user!

    const validation = userInvitationsSchema.safeParse(req.params)

    if (!validation.success) {
        return ResponseHandler.zodError(req, res, validation.error.errors)
    }

    const { userId } = validation.data

    const user = await prisma.user.findUnique({
        where: {
            id: userId,
        },
        select: {
            email: true,
        }
    })

    if (!user) {
        return ResponseHandler.notFound(req, res)
    }

    if (userId !== currentUser.id) {
        return ResponseHandler.forbidden(req, res)
    }

    const invitations = await WorkspaceUserInvitationRepository.findPendingInvitationsByEmail(user.email)

    ResponseHandler.json(res, {
        invitations
    })
}
