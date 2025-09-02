
import { IWorkspaceInvitationRepository } from '../../domain/ports/workspace-invitation-repository.interface.ts'
import { NotFoundError } from '@/shared/errors/not-found.error.ts'
import { WorkspaceInvitationPolicy } from '../../domain/policies/workspace-invitation.policy.ts'
import { RespondToWorkspaceInvitationDTO } from '../dto/respond-to-workspace-invitation.dto.ts'
import { IWorkspaceInvitationServiceFactory } from '../../domain/services/workspace-invitation-service.factory.ts'
import { IUnitOfWork } from '@/core/ports/unit-of-work.interface.ts'
import { IWorkspaceMemberServiceFactory } from '@/modules/workspace-member/domain/services/workspace-member-service.factory.ts'
import { UserAlreadyIsAMemberError } from '@/modules/workspace-member/domain/errors/user-already-is-a-member.error.ts'
import { ValidationError } from '@/shared/errors/validation.error.ts'
import { ForbiddenError } from '@/shared/errors/forbidden.error.ts'

type RespondToWorkspaceInvitationUsecaseDeps = {
    workspaceInvitationRepository: IWorkspaceInvitationRepository
    workspaceMemberServiceFactory: IWorkspaceMemberServiceFactory
    workspaceInvitationServiceFactory: IWorkspaceInvitationServiceFactory
    unitOfWork: IUnitOfWork
}

export class RespondToWorkspaceInvitationUsecase {
    constructor(private readonly deps: RespondToWorkspaceInvitationUsecaseDeps) {}

    async execute(dto: RespondToWorkspaceInvitationDTO) {
        const { workspaceInvitationRepository, workspaceInvitationServiceFactory, workspaceMemberServiceFactory, unitOfWork } = this.deps
        const { invitationId, accept, authContext } = dto
      
        const invitation = await workspaceInvitationRepository.findById(invitationId)

        if (!invitation) {
            throw new NotFoundError('Workspace invitation not found')
        }
      
        WorkspaceInvitationPolicy.enforceRespondToWorkspaceInvitation(authContext, invitation.email)
      
        if(!authContext.isUserContext()) {
            throw new ForbiddenError({
                invitationEmail: ['ONLY_USERS_CAN_ACCEPT_WORKSPACE_INVITATIONS']
            })
        }

        const currentUserId = authContext.user.id

        try {
            return await unitOfWork.execute(async (repos) => {
                const workspaceMemberService = workspaceMemberServiceFactory({ ...repos })
                const workspaceInvitationService = workspaceInvitationServiceFactory({ ...repos })
      
                const updatedInvitation = await workspaceInvitationService.respondToInvitation(invitation, accept, currentUserId)
      
                if (accept) {
                    await workspaceMemberService.addMember(invitation.workspaceId, currentUserId)
                }
      
                return updatedInvitation
            })
        } catch (error) {
            if (error instanceof UserAlreadyIsAMemberError) {
                throw new ValidationError({
                    userId: ['USER_ALREADY_IS_A_MEMBER_OF_WORKSPACE'],
                })
            }

            throw error
        }
    }
}