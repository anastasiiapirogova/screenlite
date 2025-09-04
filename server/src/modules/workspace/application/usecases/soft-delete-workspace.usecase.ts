import { AuthContext } from '@/core/types/auth-context.type.ts'
import { IWorkspaceRepository } from '../../domain/ports/workspace-repository.interface.ts'
import { NotFoundError } from '@/shared/errors/not-found.error.ts'
import { IWorkspaceAccessService } from '@/modules/workspace/domain/ports/workspace-access-service.interface.ts'
import { WorkspacePolicy } from '../../domain/policies/workspace.policy.ts'
import { ValidationError } from '@/shared/errors/validation.error.ts'
import { IWorkspaceInvariantsService } from '../../domain/ports/workspace-invariants-service.interface.ts'

interface SoftDeleteWorkspaceUsecaseDeps {
    workspaceRepository: IWorkspaceRepository
    workspaceAccessService: IWorkspaceAccessService
    workspaceInvariantsService: IWorkspaceInvariantsService
}

export class SoftDeleteWorkspaceUsecase {
    constructor(private readonly deps: SoftDeleteWorkspaceUsecaseDeps) {}

    async execute(workspaceId: string, authContext: AuthContext) {
        const { workspaceRepository, workspaceAccessService, workspaceInvariantsService } = this.deps

        const workspace = await workspaceRepository.findById(workspaceId)
        
        if (!workspace) {
            throw new NotFoundError('WORKSPACE_NOT_FOUND')
        }

        await workspaceInvariantsService.enforceWorkspaceIsNotDeleted(workspace, authContext)

        const workspaceAccess = await workspaceAccessService.checkAccess(workspace.id, authContext)

        WorkspacePolicy.enforceSoftDeleteWorkspace(authContext, workspaceAccess)

        if (workspace.state.isDeleted()) {
            throw new ValidationError({
                workspaceId: ['WORKSPACE_IS_ALREADY_DELETED']
            })
        }

        workspace.state.markAsDeleted()

        await this.deps.workspaceRepository.save(workspace)

        return workspace
    }
}