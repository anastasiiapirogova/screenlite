import { Request, Response } from 'express'
import { ResponseHandler } from '@/utils/ResponseHandler.ts'
import { inviteUserToWorkspaceSchema } from '../schemas/workspaceUserInvitationSchemas.ts'
import { WorkspaceUserInvitationRepository } from '../repositories/WorkspaceUserInvitationRepository.ts'
import { UserRepository } from '@/modules/user/repositories/UserRepository.ts'

export const inviteUserToWorkspace = async (req: Request, res: Response) => {
    const user = req.user!
    const workspace = req.workspace!

    const validation = inviteUserToWorkspaceSchema.safeParse(req.query)

    if (!validation.success) {
        return ResponseHandler.zodError(req, res, validation.error.errors)
    }

    const { email } = validation.data

    const hasPendingInvitation = await WorkspaceUserInvitationRepository.hasPendingInvitation(email, workspace.id)

    if (hasPendingInvitation) {
        return ResponseHandler.validationError(req, res, {
            email: 'INVITATION_ALREADY_EXISTS',
        })
    }

    const existingUser = await UserRepository.findByEmail(email)

    if (existingUser) {
        const isUserWorkspaceMember = await WorkspaceUserInvitationRepository.isUserWorkspaceMember(
            workspace.id,
            existingUser.id,
        )

        if (isUserWorkspaceMember) {
            return ResponseHandler.validationError(req, res, {
                email: 'USER_ALREADY_MEMBER',
            })
        }
    }

    const userInvitation = await WorkspaceUserInvitationRepository.create({
        email,
        workspaceId: workspace.id,
        invitorId: user.id,
    })

    ResponseHandler.created(res, {
        invitation: userInvitation
    })
}
