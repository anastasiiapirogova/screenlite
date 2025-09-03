import { IUserRepository } from '@/modules/user/domain/ports/user-repository.interface.ts'
import { IWorkspaceInvitationRepository } from '../ports/workspace-invitation-repository.interface.ts'
import { WorkspaceInvitationService } from './workspace-invitation.service.ts'
import { IWorkspaceInvitationService } from '../ports/workspace-invitation-service.interface.ts'
import { IWorkspaceMemberRepository } from '@/modules/workspace-member/domain/ports/workspace-member-repository.interface.ts'

export type IWorkspaceInvitationServiceFactory = (deps: {
    workspaceInvitationRepository: IWorkspaceInvitationRepository
    userRepository: IUserRepository
    workspaceMemberRepository: IWorkspaceMemberRepository
}) => IWorkspaceInvitationService

export const workspaceInvitationServiceFactory: IWorkspaceInvitationServiceFactory = (deps) => {
    return new WorkspaceInvitationService(
        {
            workspaceInvitationRepository: deps.workspaceInvitationRepository,
            userRepository: deps.userRepository,
            workspaceMemberRepository: deps.workspaceMemberRepository
        }
    )
}