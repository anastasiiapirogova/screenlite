import { PaginationResponse } from '@/core/types/pagination.types.ts'
import { WorkspaceInvitationWithDetailsView } from '../../presentation/view-models/workspace-invitation-with-details.view.ts'
import { GlobalWorkspaceInvitationsQueryOptionsDTO } from '../dto/global-workspace-invitations-query-options.dto.ts'

export interface IWorkspaceInvitationsWithWorkspaceQuery {
    getWorkspaceInvitationsWithWorkspace(queryOptions: GlobalWorkspaceInvitationsQueryOptionsDTO): Promise<PaginationResponse<WorkspaceInvitationWithDetailsView>>
}