import { IWorkspaceRepository } from '@/modules/workspace/domain/ports/workspace-repository.interface.ts'
import { IWorkspaceInvitationRepository } from '../../domain/ports/workspace-invitation-repository.interface.ts'
import { PaginationResponse } from '@/core/types/pagination.types.ts'
import { WorkspaceInvitation } from '@/core/entities/workspace-invitation.entity.ts'
import { NotFoundError } from '@/shared/errors/not-found.error.ts'
import { IWorkspaceAccessService } from '@/modules/workspace/domain/ports/workspace-access-service.interface.ts'
import { GetWorkspaceInvitationsByWorkspaceDTO } from '../dto/get-workspace-invitations-by-workspace.dto.ts'
import { WorkspaceInvitationListPolicy } from '../../domain/policies/workspace-invitation-list.policy.ts'
import { IWorkspaceInvariantsService } from '@/modules/workspace/domain/ports/workspace-invariants-service.interface.ts'

type GetWorkspaceInvitationsByWorkspaceUsecaseDeps = {
    workspaceInvitationRepository: IWorkspaceInvitationRepository
    workspaceRepository: IWorkspaceRepository
    workspaceAccessService: IWorkspaceAccessService
    workspaceInvariantsService: IWorkspaceInvariantsService
}

export class GetWorkspaceInvitationsByWorkspaceUsecase {
    constructor(
        private readonly deps: GetWorkspaceInvitationsByWorkspaceUsecaseDeps
    ) {}

    async execute(dto: GetWorkspaceInvitationsByWorkspaceDTO): Promise<PaginationResponse<WorkspaceInvitation>> {
        const { workspaceInvitationRepository, workspaceRepository, workspaceAccessService, workspaceInvariantsService } = this.deps

        const { authContext, queryOptions } = dto

        const workspace = await workspaceRepository.findById(queryOptions.filters.workspaceId)

        if (!workspace) {
            throw new NotFoundError('WORKSPACE_NOT_FOUND')
        }

        const workspaceAccess = await workspaceAccessService.checkAccess(workspace.id, authContext)

        WorkspaceInvitationListPolicy.enforceViewWorkspaceInvitations(authContext, workspaceAccess)

        await workspaceInvariantsService.enforceWorkspaceActiveForNonAdmin(workspace, authContext)

        return workspaceInvitationRepository.findAll(queryOptions)
    }
}