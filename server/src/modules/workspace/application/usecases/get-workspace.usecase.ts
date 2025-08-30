import { NotFoundError } from '@/shared/errors/not-found.error.ts'
import { IWorkspaceRepository } from '../../domain/ports/workspace-repository.interface.ts'
import { IWorkspaceMemberService } from '@/modules/workspace-member/domain/ports/workspace-member-service.interface.ts'
import { AuthContext } from '@/core/types/auth-context.type.ts'
import { WorkspacePolicy } from '../../domain/policies/workspace.policy.ts'

type GetWorkspaceUsecaseDeps = {
    workspaceRepository: IWorkspaceRepository
    workspaceMemberService: IWorkspaceMemberService
}

export class GetWorkspaceUsecase {
    constructor(private readonly deps: GetWorkspaceUsecaseDeps) {}

    async execute(workspaceId: string, authContext: AuthContext) {
        const { workspaceRepository, workspaceMemberService } = this.deps

        let isMember = false
        
        const workspace = await workspaceRepository.findById(workspaceId)
        
        if (!workspace) {
            throw new NotFoundError('Workspace not found')
        }

        if(authContext.isUserContext()) {
            isMember = await workspaceMemberService.isMember(workspace.id, authContext.user.id)
        }

        WorkspacePolicy.enforceViewWorkspace(authContext, isMember)

        return workspace
    }
}