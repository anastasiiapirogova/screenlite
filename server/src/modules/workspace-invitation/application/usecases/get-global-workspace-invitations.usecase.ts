import { WorkspaceInvitationListPolicy } from '../../domain/policies/workspace-invitation-list.policy.ts'
import { PaginationResponse } from '@/core/types/pagination.types.ts'
import { GetGlobalWorkspaceInvitationsDTO } from '../dto/get-global-workspace-invitations.dto.ts'
import { WorkspaceInvitation } from '@/core/entities/workspace-invitation.entity.ts'
import { IWorkspaceInvitationRepository } from '../../domain/ports/workspace-invitation-repository.interface.ts'

type GetGlobalWorkspaceInvitationsUsecaseDeps = {
    workspaceInvitationRepository: IWorkspaceInvitationRepository
}

export class GetGlobalWorkspaceInvitationsUsecase {
    constructor(
        private readonly deps: GetGlobalWorkspaceInvitationsUsecaseDeps
    ) {}

    async execute(dto: GetGlobalWorkspaceInvitationsDTO): Promise<PaginationResponse<WorkspaceInvitation>> {
        const { workspaceInvitationRepository } = this.deps
        
        const { authContext, queryOptions } = dto
        
        WorkspaceInvitationListPolicy.enforceViewAllWorkspaceInvitations(authContext)

        return workspaceInvitationRepository.findAll(queryOptions)
    }
}