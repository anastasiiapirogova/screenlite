import { Request, Response } from 'express'
import { ResponseHandler } from '@/utils/ResponseHandler.ts'
import { acceptUserWorkspaceInvitationSchema } from '../schemas/workspaceUserInvitationSchemas.ts'
import { WorkspaceUserInvitationRepository } from '../repositories/WorkspaceUserInvitationRepository.ts'
import { prisma } from '@/config/prisma.ts'
import { MemberRepository } from '@/modules/member/repositories/MemberRepository.ts'

export const acceptUserWorkspaceInvitation = async (req: Request, res: Response) => {
    const user = req.user!

    const validation = acceptUserWorkspaceInvitationSchema.safeParse(req.query)

    if (!validation.success) {
        return ResponseHandler.zodError(req, res, validation.error.errors)
    }

    const { workspaceUserInvitationId } = validation.data

    const workspaceUserInvitation = await WorkspaceUserInvitationRepository.find(workspaceUserInvitationId)

    if (!workspaceUserInvitation) {
        return ResponseHandler.notFound(req, res)
    }

    const isPending = workspaceUserInvitation.status === WorkspaceUserInvitationRepository.STATUS.PENDING

    if(!isPending) {
        return ResponseHandler.validationError(req, res, {
            workspaceUserInvitationId: 'INVITATION_NOT_PENDING',
        })
    }

    const isUserWorkspaceMember = await WorkspaceUserInvitationRepository.isUserWorkspaceMember(
        workspaceUserInvitation.workspaceId,
        user.id,
    )

    if (isUserWorkspaceMember) {
        return ResponseHandler.validationError(req, res, {
            workspaceUserInvitationId: 'USER_ALREADY_MEMBER',
        })
    }

    const [updatedInvitation, member] = await prisma.$transaction([
        WorkspaceUserInvitationRepository.acceptInvitationPromise(workspaceUserInvitationId),
        MemberRepository.addMemberPromise({
            userId: user.id,
            workspaceId: workspaceUserInvitation.workspaceId,
            workspaceInvitationId: workspaceUserInvitationId,
            permissions: []
        })
    ])
   
    ResponseHandler.json(res, {
        invitation: updatedInvitation,
        member,
    })
}
