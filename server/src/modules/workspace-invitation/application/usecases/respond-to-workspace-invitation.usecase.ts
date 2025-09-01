
import { IWorkspaceInvitationRepository } from '../../domain/ports/workspace-invitation-repository.interface.ts'
import { NotFoundError } from '@/shared/errors/not-found.error.ts'
import { WorkspaceInvitationPolicy } from '../../domain/policies/workspace-invitation.policy.ts'
import { IWorkspaceInvitationService } from '../../domain/ports/workspace-invitation-service.interface.ts'
import { RespondToWorkspaceInvitationDTO } from '../dto/respond-to-workspace-invitation.dto.ts'
import { UserSessionAuthContext } from '@/core/auth/user-session-auth.context.ts'

type RespondToWorkspaceInvitationUsecaseDeps = {
    workspaceInvitationRepository: IWorkspaceInvitationRepository
    workspaceInvitationService: IWorkspaceInvitationService
}

export class RespondToWorkspaceInvitationUsecase {
    constructor(private readonly deps: RespondToWorkspaceInvitationUsecaseDeps) {}

    async execute(dto: RespondToWorkspaceInvitationDTO) {
        const { workspaceInvitationRepository, workspaceInvitationService } = this.deps

        const { invitationId, accept, authContext } = dto

        const invitation = await workspaceInvitationRepository.findById(invitationId)

        if (!invitation) {
            throw new NotFoundError('Workspace invitation not found')
        }

        WorkspaceInvitationPolicy.enforceRespondToWorkspaceInvitation(authContext, invitation.email)
        
        const currentUserId = (authContext as UserSessionAuthContext).user.id

        const workspaceInvitation = await workspaceInvitationService.respondToInvitation(invitation, accept, currentUserId)

        return workspaceInvitation
    }
}