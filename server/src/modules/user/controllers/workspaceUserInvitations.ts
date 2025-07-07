import { Request, Response } from 'express'
import { prisma } from '@/config/prisma.ts'
import { ResponseHandler } from '@/utils/ResponseHandler.ts'
import { workspaceUserInvitationsSchema } from '../schemas/userSchemas.ts'
import { WorkspaceUserInvitationRepository } from '@workspaceModules/modules/workspaceUserInvitation/repositories/WorkspaceUserInvitationRepository.ts'

export const workspaceUserInvitations = async (req: Request, res: Response) => {
    const currentUser = req.user!

    const validation = workspaceUserInvitationsSchema.safeParse(req.params)

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
