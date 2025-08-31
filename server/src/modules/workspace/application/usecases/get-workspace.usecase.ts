import { NotFoundError } from '@/shared/errors/not-found.error.ts'
import { IWorkspaceRepository } from '../../domain/ports/workspace-repository.interface.ts'
import { AuthContext } from '@/core/types/auth-context.type.ts'
import { WorkspacePolicy } from '../../domain/policies/workspace.policy.ts'
import { IWorkspaceAccessService } from '../../domain/ports/workspace-access-service.interface.ts'

type GetWorkspaceUsecaseDeps = {
    workspaceRepository: IWorkspaceRepository
    workspaceAccessService: IWorkspaceAccessService
}

export class GetWorkspaceUsecase {
    constructor(private readonly deps: GetWorkspaceUsecaseDeps) {}

    async execute(workspaceId: string, authContext: AuthContext) {
        const { workspaceRepository, workspaceAccessService } = this.deps

        const workspace = await workspaceRepository.findById(workspaceId)
        
        if (!workspace) {
            throw new NotFoundError('Workspace not found')
        }

        const workspaceAccess = await workspaceAccessService.checkAccess(workspaceId, authContext)

        WorkspacePolicy.enforceViewWorkspace(authContext, workspaceAccess)

        return workspace
    }
}