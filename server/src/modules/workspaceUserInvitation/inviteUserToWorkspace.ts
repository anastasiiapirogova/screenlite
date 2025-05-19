import { Request, Response } from 'express'
import { ResponseHandler } from '@utils/ResponseHandler.js'
import { WorkspaceUserInvitationPolicy } from './policies/WorkspaceUserInvitationPolicy.js'
import { inviteUserToWorkspaceSchema } from './schemas/workspaceUserInvitationSchemas.js'
import { WorkspaceUserInvitationRepository } from './repositories/WorkspaceUserInvitationRepository.js'
import { WorkspaceRepository } from '@modules/workspace/repositories/WorkspaceRepository.js'
import { UserRepository } from '@modules/user/repositories/UserRepository.js'

export const inviteUserToWorkspace = async (req: Request, res: Response) => {
    const user = req.user!
    const { slug } = req.params

    const validation = inviteUserToWorkspaceSchema.safeParse(req.query)

    if (!validation.success) {
        return ResponseHandler.zodError(req, res, validation.error.errors)
    }

    const { email, workspaceId } = validation.data

    const workspace = await WorkspaceRepository.findBySlug(slug)

    if (!workspace) {
        return ResponseHandler.notFound(res)
    }

    const allowed = await WorkspaceUserInvitationPolicy.canInviteUsers(user, workspace.id)

    if (!allowed) {
        return ResponseHandler.forbidden(res)
    }

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
        workspaceId,
        invitorId: user.id,
    })

    ResponseHandler.created(res, {
        invitation: userInvitation
    })
}
