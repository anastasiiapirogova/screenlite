import { IUserRepository } from '@/modules/user/domain/ports/user-repository.interface.ts'
import { IWorkspaceInvitationRepository } from '../ports/workspace-invitation-repository.interface.ts'
import { IWorkspaceInvitationService } from '../ports/workspace-invitation-service.interface.ts'
import { IWorkspaceMemberService } from '@/modules/workspace-member/domain/ports/workspace-member-service.interface.ts'
import { WorkspaceInvitation } from '@/core/entities/workspace-invitation.entity.ts'
import { WorkspaceInvitationStatus } from '@/core/enums/workspace-invitation-status.enum.ts'
import { WorkspaceInvitationFactory } from '@/core/factories/workspace-invitation.factory.ts'
import { ValidationError } from '@/shared/errors/validation.error.ts'
import { UserAlreadyIsAMemberError } from '@/modules/workspace-member/domain/errors/user-already-is-a-member.error.ts'

type WorkspaceInvitationServiceDeps = {
    invitationRepository: IWorkspaceInvitationRepository
    userRepository: IUserRepository
    workspaceMemberService: IWorkspaceMemberService
}

export class WorkspaceInvitationService implements IWorkspaceInvitationService {
    private readonly invitationRepository: IWorkspaceInvitationRepository
    private readonly userRepository: IUserRepository
    private readonly workspaceMemberService: IWorkspaceMemberService

    constructor(
        private readonly deps: WorkspaceInvitationServiceDeps
    ) {
        this.invitationRepository = deps.invitationRepository
        this.userRepository = deps.userRepository
        this.workspaceMemberService = deps.workspaceMemberService
    }
    
    async inviteUser(params: {
        workspaceId: string
        email: string
    }): Promise<WorkspaceInvitation> {
        const { workspaceId, email } = params
      
        const user = await this.userRepository.findByEmail(email)
      
        const isAlreadyMember = user ? 
            await this.workspaceMemberService.isMember(workspaceId, user.id) : 
            false

        if (isAlreadyMember) {
            throw new ValidationError({
                email: ['USER_IS_ALREADY_A_MEMBER_OF_WORKSPACE']
            })
        }
      
        const pendingInvitation = await this.invitationRepository
            .countByWorkspaceIdEmailAndStatus(workspaceId, email, [WorkspaceInvitationStatus.PENDING])
      
        const hasPendingInvitation = pendingInvitation > 0

        if (hasPendingInvitation) {
            throw new ValidationError({
                email: ['USER_HAS_A_PENDING_INVITATION_FOR_WORKSPACE']
            })
        }

        const invitation = WorkspaceInvitationFactory.create({
            workspaceId,
            email,
            status: WorkspaceInvitationStatus.PENDING
        })
      
        await this.invitationRepository.save(invitation)
      
        return invitation
    }

    async respondToInvitation(invitation: WorkspaceInvitation, accept: boolean, userId: string): Promise<void> {
        if (accept) {
            return await this.acceptInvitation(invitation, userId)
        } else {
            return await this.rejectInvitation(invitation)
        }
    }
    
    async acceptInvitation(invitation: WorkspaceInvitation, userId: string): Promise<void> {
        if (!invitation.isPending) {
            throw new ValidationError({
                invitation: ['INVITATION_IS_NOT_PENDING']
            })
        }

        const user = await this.userRepository.findById(userId)

        if (!user || invitation.email !== user.email.current) {
            throw new ValidationError({
                email: ['USER_EMAIL_DOES_NOT_MATCH_INVITATION']
            })
        }
      
        invitation.accept()

        try {
            await this.workspaceMemberService.addMember(
                invitation.workspaceId,
                userId,
            )
        } catch (error) {
            if(error instanceof UserAlreadyIsAMemberError) {
                throw new ValidationError({
                    email: ['USER_ALREADY_IS_A_MEMBER_OF_WORKSPACE']
                })
            }

            throw error
        }
        
        await this.invitationRepository.save(invitation)
    }
    
    async rejectInvitation(invitation: WorkspaceInvitation): Promise<void> {
        if (!invitation.isPending) {
            throw new ValidationError({
                invitation: ['INVITATION_IS_NOT_PENDING']
            })
        }

        invitation.reject()

        await this.invitationRepository.save(invitation)
    }
    
    async cancelInvitation(invitation: WorkspaceInvitation): Promise<void> {
        if (!invitation.isPending) {
            throw new ValidationError({
                invitation: ['INVITATION_IS_NOT_PENDING']
            })
        }

        invitation.cancel()
      
        await this.invitationRepository.save(invitation)
    }
}