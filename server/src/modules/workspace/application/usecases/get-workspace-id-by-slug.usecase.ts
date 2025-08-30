import { NotFoundError } from '@/shared/errors/not-found.error.ts'
import { IWorkspaceRepository } from '../../domain/ports/workspace-repository.interface.ts'
import { IWorkspaceMemberService } from '@/modules/workspace-member/domain/ports/workspace-member-service.interface.ts'
import { AuthContext } from '@/core/types/auth-context.type.ts'
import { WorkspacePolicy } from '../../domain/policies/workspace.policy.ts'

type GetWorkspaceIdBySlugUsecaseDeps = {
    workspaceRepository: IWorkspaceRepository
    workspaceMemberService: IWorkspaceMemberService
}

export class GetWorkspaceIdBySlugUsecase {
    constructor(private readonly deps: GetWorkspaceIdBySlugUsecaseDeps) {}

    async execute(slug: string, authContext: AuthContext): Promise<string> {
        const { workspaceRepository, workspaceMemberService } = this.deps

        let isMember = false
        
        const workspace = await workspaceRepository.findBySlug(slug)
        
        if (!workspace) {
            throw new NotFoundError('Workspace not found')
        }

        if(authContext.isUserContext()) {
            isMember = await workspaceMemberService.isMember(workspace.id, authContext.user.id)
        }

        WorkspacePolicy.enforceViewWorkspace(authContext, isMember)

        return workspace.id
    }
}