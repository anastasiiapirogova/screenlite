import { WorkspaceInvitationListPolicy } from '../../domain/policies/workspace-invitation-list.policy.ts'
import { PaginationResponse } from '@/core/types/pagination.types.ts'
import { GetGlobalWorkspaceInvitationsDTO } from '../dto/get-global-workspace-invitations.dto.ts'
import { IWorkspaceInvitationsWithWorkspaceQuery } from '../../domain/ports/workspace-invitations-with-workspace-query.interface.ts'
import { WorkspaceInvitationWithDetailsView } from '../../presentation/view-models/workspace-invitation-with-details.view.ts'

type GetGlobalWorkspaceInvitationsUsecaseDeps = {
    workspaceInvitationsWithWorkspaceQuery: IWorkspaceInvitationsWithWorkspaceQuery
}

export class GetGlobalWorkspaceInvitationsUsecase {
    constructor(
        private readonly deps: GetGlobalWorkspaceInvitationsUsecaseDeps
    ) {}

    async execute(dto: GetGlobalWorkspaceInvitationsDTO): Promise<PaginationResponse<WorkspaceInvitationWithDetailsView>> {
        const { workspaceInvitationsWithWorkspaceQuery } = this.deps
        
        const { authContext, queryOptions } = dto
        
        WorkspaceInvitationListPolicy.enforceViewAllWorkspaceInvitations(authContext)

        return workspaceInvitationsWithWorkspaceQuery.getWorkspaceInvitationsWithWorkspace(queryOptions)
    }
}