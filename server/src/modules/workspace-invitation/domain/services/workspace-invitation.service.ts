import { IUserRepository } from '@/modules/user/domain/ports/user-repository.interface.ts'
import { IWorkspaceInvitationRepository } from '../ports/workspace-invitation-repository.interface.ts'
import { IWorkspaceInvitationService } from '../ports/workspace-invitation-service.interface.ts'
import { WorkspaceInvitation } from '@/core/entities/workspace-invitation.entity.ts'
import { WorkspaceInvitationStatus } from '@/core/enums/workspace-invitation-status.enum.ts'
import { WorkspaceInvitationFactory } from '@/core/factories/workspace-invitation.factory.ts'
import { ValidationError } from '@/shared/errors/validation.error.ts'
import { IWorkspaceMemberRepository } from '@/core/ports/workspace-member-repository.interface.ts'

type WorkspaceInvitationServiceDeps = {
    workspaceInvitationRepository: IWorkspaceInvitationRepository
    userRepository: IUserRepository
    workspaceMemberRepository: IWorkspaceMemberRepository
}

export class WorkspaceInvitationService implements IWorkspaceInvitationService {
    private readonly workspaceInvitationRepository: IWorkspaceInvitationRepository
    private readonly userRepository: IUserRepository
    private readonly workspaceMemberRepository: IWorkspaceMemberRepository

    constructor(
        deps: WorkspaceInvitationServiceDeps
    ) {
        this.workspaceInvitationRepository = deps.workspaceInvitationRepository
        this.userRepository = deps.userRepository
        this.workspaceMemberRepository = deps.workspaceMemberRepository
    }

    async ensureCanInvite(workspaceId: string, email: string): Promise<void> {
        const user = await this.userRepository.findByEmail(email)
    
        if (user) {
            const isMember = await this.workspaceMemberRepository.findByWorkspaceAndUser(workspaceId, user.id)

            if (isMember) {
                throw new ValidationError({ email: ['USER_IS_ALREADY_A_MEMBER_OF_WORKSPACE'] })
            }
        }
    
        const pendingInvitation = await this.workspaceInvitationRepository
            .countByWorkspaceIdEmailAndStatus(workspaceId, email, [WorkspaceInvitationStatus.PENDING])
    
        if (pendingInvitation > 0) {
            throw new ValidationError({ email: ['USER_HAS_A_PENDING_INVITATION_FOR_WORKSPACE'] })
        }
    }
    
    async inviteUser(params: {
        workspaceId: string
        email: string
        initiatorId: string
    }): Promise<WorkspaceInvitation> {
        const { workspaceId, email, initiatorId } = params
      
        await this.ensureCanInvite(workspaceId, email)

        const invitation = WorkspaceInvitationFactory.create({
            workspaceId,
            email,
            status: WorkspaceInvitationStatus.PENDING,
            initiatorId
        })
      
        await this.workspaceInvitationRepository.save(invitation)

        return invitation
    }

    async respondToInvitation(invitation: WorkspaceInvitation, accept: boolean, userId: string): Promise<WorkspaceInvitation> {
        if (accept) {
            return await this.acceptInvitation(invitation, userId)
        } else {
            return await this.rejectInvitation(invitation)
        }
    }

    async acceptInvitation(invitation: WorkspaceInvitation, userId: string): Promise<WorkspaceInvitation> {
        if (!invitation.isPending) {
            throw new ValidationError({
                invitation: ['INVITATION_IS_NOT_PENDING']
            })
        }

        const user = await this.userRepository.findById(userId)

        if (!user || invitation.email !== user.email.current) {
            throw new ValidationError({
                userId: ['USER_EMAIL_DOES_NOT_MATCH_INVITATION']
            })
        }
      
        invitation.accept()
        
        await this.workspaceInvitationRepository.save(invitation)

        return invitation
    }
    
    async rejectInvitation(invitation: WorkspaceInvitation): Promise<WorkspaceInvitation> {
        if (!invitation.isPending) {
            throw new ValidationError({
                invitation: ['INVITATION_IS_NOT_PENDING']
            })
        }

        invitation.reject()

        await this.workspaceInvitationRepository.save(invitation)

        return invitation
    }
    
    async cancelInvitation(invitation: WorkspaceInvitation): Promise<WorkspaceInvitation> {
        if (!invitation.isPending) {
            throw new ValidationError({
                invitation: ['INVITATION_IS_NOT_PENDING']
            })
        }

        invitation.cancel()
      
        await this.workspaceInvitationRepository.save(invitation)

        return invitation
    }
}