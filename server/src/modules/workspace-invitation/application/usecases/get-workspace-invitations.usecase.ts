import { IWorkspaceRepository } from '@/modules/workspace/domain/ports/workspace-repository.interface.ts'
import { IWorkspaceInvitationRepository } from '../../domain/ports/workspace-invitation-repository.interface.ts'
import { GetWorkspaceInvitationsDTO } from '../dto/get-workspace-invitations.dto.ts'
import { PaginationResponse } from '@/core/types/pagination.types.ts'
import { WorkspaceInvitation } from '@/core/entities/workspace-invitation.entity.ts'
import { NotFoundError } from '@/shared/errors/not-found.error.ts'
import { WorkspacePolicy } from '@/modules/workspace/domain/policies/workspace.policy.ts'
import { IWorkspaceAccessService } from '@/modules/workspace/domain/ports/workspace-access-service.interface.ts'

type GetWorkspaceInvitationsUsecaseDeps = {
    workspaceInvitationRepository: IWorkspaceInvitationRepository
    workspaceRepository: IWorkspaceRepository
    workspaceAccessService: IWorkspaceAccessService
}

export class GetWorkspaceInvitationsUsecase {
    constructor(
        private readonly deps: GetWorkspaceInvitationsUsecaseDeps
    ) {}

    async execute(dto: GetWorkspaceInvitationsDTO): Promise<PaginationResponse<WorkspaceInvitation>> {
        const { workspaceInvitationRepository, workspaceRepository, workspaceAccessService } = this.deps

        const { authContext, queryOptions } = dto

        const workspace = await workspaceRepository.findById(queryOptions.filters.workspaceId)

        if (!workspace) {
            throw new NotFoundError('WORKSPACE_NOT_FOUND')
        }

        const workspaceAccess = await workspaceAccessService.checkAccess(workspace.id, authContext)

        WorkspacePolicy.enforceViewInvitations(authContext, workspaceAccess)

        return workspaceInvitationRepository.findAll(queryOptions)
    }
}