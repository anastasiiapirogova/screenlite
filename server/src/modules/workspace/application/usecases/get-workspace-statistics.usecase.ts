import { NotFoundError } from '@/shared/errors/not-found.error.ts'
import { IWorkspaceStatisticsQuery } from '../../domain/ports/workspace-statistics-query.interface.ts'
import { AuthContext } from '@/core/types/auth-context.type.ts'
import { WorkspacePolicy } from '../../domain/policies/workspace.policy.ts'
import { IWorkspaceAccessService } from '../../domain/ports/workspace-access-service.interface.ts'
import { IWorkspaceRepository } from '../../domain/ports/workspace-repository.interface.ts'

type GetWorkspaceStatisticsUseCaseDeps = {
    workspaceStatisticsQuery: IWorkspaceStatisticsQuery
    workspaceRepository: IWorkspaceRepository
    workspaceAccessService: IWorkspaceAccessService
}

export class GetWorkspaceStatisticsUseCase {
    constructor(
        private readonly deps: GetWorkspaceStatisticsUseCaseDeps
    ) {}

    async execute(workspaceId: string, authContext: AuthContext) {
        const { workspaceStatisticsQuery, workspaceRepository, workspaceAccessService } = this.deps

        const workspace = await workspaceRepository.findById(workspaceId)
    
        if (!workspace) {
            throw new NotFoundError('WORKSPACE_NOT_FOUND')
        }
    
        const workspaceAccess = await workspaceAccessService.checkAccess(workspaceId, authContext)

        WorkspacePolicy.enforceViewWorkspace(authContext, workspaceAccess)
    
        return workspaceStatisticsQuery.getWorkspaceStatistics(workspaceId)
    }
}