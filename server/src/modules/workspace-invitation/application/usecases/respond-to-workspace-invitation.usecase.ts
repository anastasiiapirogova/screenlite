
import { IWorkspaceInvitationRepository } from '../../domain/ports/workspace-invitation-repository.interface.ts'
import { NotFoundError } from '@/shared/errors/not-found.error.ts'
import { WorkspaceInvitationPolicy } from '../../domain/policies/workspace-invitation.policy.ts'
import { RespondToWorkspaceInvitationDTO } from '../dto/respond-to-workspace-invitation.dto.ts'
import { IWorkspaceInvitationServiceFactory } from '../../domain/services/workspace-invitation-service.factory.ts'
import { IUnitOfWork } from '@/core/ports/unit-of-work.interface.ts'
import { IWorkspaceMemberServiceFactory } from '@/modules/workspace-member/domain/services/workspace-member-service.factory.ts'
import { UserAlreadyIsAMemberError } from '@/modules/workspace-member/domain/errors/user-already-is-a-member.error.ts'
import { ValidationError } from '@/shared/errors/validation.error.ts'
import { UserSessionAuthContext } from '@/core/auth/user-session-auth.context.ts'
import { IWorkspaceInvariantsService } from '@/modules/workspace/domain/ports/workspace-invariants-service.interface.ts'
import { IWorkspaceRepository } from '@/modules/workspace/domain/ports/workspace-repository.interface.ts'

type RespondToWorkspaceInvitationUsecaseDeps = {
    workspaceInvitationRepository: IWorkspaceInvitationRepository
    workspaceMemberServiceFactory: IWorkspaceMemberServiceFactory
    workspaceInvitationServiceFactory: IWorkspaceInvitationServiceFactory
    unitOfWork: IUnitOfWork
    workspaceInvariantsService: IWorkspaceInvariantsService
    workspaceRepository: IWorkspaceRepository
}

export class RespondToWorkspaceInvitationUsecase {
    constructor(private readonly deps: RespondToWorkspaceInvitationUsecaseDeps) {}

    async execute(dto: RespondToWorkspaceInvitationDTO) {
        const { workspaceInvitationRepository, workspaceInvitationServiceFactory, workspaceMemberServiceFactory, unitOfWork, workspaceInvariantsService, workspaceRepository } = this.deps
        const { invitationId, accept, authContext } = dto
      
        const invitation = await workspaceInvitationRepository.findById(invitationId)

        if (!invitation) {
            throw new NotFoundError('Workspace invitation not found')
        }
      
        WorkspaceInvitationPolicy.enforceRespondToWorkspaceInvitation(authContext, invitation.email)

        if (accept) {
            const workspace = await workspaceRepository.findById(invitation.workspaceId)

            if (!workspace) {
                throw new NotFoundError('Workspace not found')
            }

            await workspaceInvariantsService.enforceWorkspaceActive(workspace)
        }
      
        const currentUserId = (authContext as UserSessionAuthContext).user.id

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