import { IUserRepository } from '@/modules/user/domain/ports/user-repository.interface.ts'
import { WorkspaceMemberService } from './workspace-member.service.ts'
import { IWorkspaceMemberRepository } from '@/modules/workspace-member/domain/ports/workspace-member-repository.interface.ts'
import { IWorkspaceRepository } from '@/modules/workspace/domain/ports/workspace-repository.interface.ts'

export type IWorkspaceMemberServiceFactory = (deps: {
    workspaceMemberRepository: IWorkspaceMemberRepository
    userRepository: IUserRepository
    workspaceRepository: IWorkspaceRepository
}) => WorkspaceMemberService

export const workspaceMemberServiceFactory: IWorkspaceMemberServiceFactory = (deps) => {
    return new WorkspaceMemberService(
        deps.workspaceMemberRepository,
        deps.userRepository,
        deps.workspaceRepository
    )
}