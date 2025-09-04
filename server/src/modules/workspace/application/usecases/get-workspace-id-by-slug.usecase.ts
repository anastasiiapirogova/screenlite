import { NotFoundError } from '@/shared/errors/not-found.error.ts'
import { IWorkspaceRepository } from '../../domain/ports/workspace-repository.interface.ts'
import { AuthContext } from '@/core/types/auth-context.type.ts'
import { WorkspacePolicy } from '../../domain/policies/workspace.policy.ts'
import { IWorkspaceAccessService } from '../../domain/ports/workspace-access-service.interface.ts'
import { IWorkspaceInvariantsService } from '../../domain/ports/workspace-invariants-service.interface.ts'

type GetWorkspaceIdBySlugUsecaseDeps = {
    workspaceRepository: IWorkspaceRepository
    workspaceAccessService: IWorkspaceAccessService
    workspaceInvariantsService: IWorkspaceInvariantsService
}

export class GetWorkspaceIdBySlugUsecase {
    constructor(private readonly deps: GetWorkspaceIdBySlugUsecaseDeps) {}

    async execute(slug: string, authContext: AuthContext): Promise<string> {
        const { workspaceRepository, workspaceAccessService, workspaceInvariantsService } = this.deps
        
        const workspace = await workspaceRepository.findBySlug(slug)
        
        if (!workspace) {
            throw new NotFoundError('WORKSPACE_NOT_FOUND')
        }

        await workspaceInvariantsService.enforceWorkspaceIsNotDeleted(workspace, authContext)

        const workspaceAccess = await workspaceAccessService.checkAccess(workspace.id, authContext)

        WorkspacePolicy.enforceViewWorkspace(authContext, workspaceAccess)

        return workspace.id
    }
}