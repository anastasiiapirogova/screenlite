import { IWorkspaceRepository } from '@/modules/workspace/domain/ports/workspace-repository.interface.ts'
import { NotFoundError } from '@/shared/errors/not-found.error.ts'
import { IWorkspaceMemberService } from '../../domain/ports/workspace-member-service.interface.ts'
import { AuthContext } from '@/core/types/auth-context.type.ts'
import { IWorkspaceAccessService } from '@/modules/workspace/domain/ports/workspace-access-service.interface.ts'
import { WorkspaceMemberPolicy } from '../../domain/policies/workspace-member.policy.ts'

type LeaveWorkspaceUsecaseDeps = {
    workspaceRepository: IWorkspaceRepository
    workspaceMemberService: IWorkspaceMemberService
    workspaceAccessService: IWorkspaceAccessService
}

export class LeaveWorkspaceUsecase {
    constructor(private readonly deps: LeaveWorkspaceUsecaseDeps) {}

    async execute(authContext: AuthContext, workspaceId: string): Promise<void> {
        const { workspaceRepository, workspaceMemberService, workspaceAccessService } = this.deps

        const workspace = await workspaceRepository.findById(workspaceId)

        if (!workspace) {
            throw new NotFoundError(`Workspace ${workspaceId} not found`)
        }

        const workspaceAccess = await workspaceAccessService.checkAccess(workspaceId, authContext)

        WorkspaceMemberPolicy.enforceLeaveWorkspace(workspaceAccess)

        await workspaceMemberService.removeMember(workspaceAccess.member!.id)
    }
}