import { WorkspaceInvitation } from '@/core/entities/workspace-invitation.entity.ts'
import { PaginationResponse } from '@/core/types/pagination.types.ts'
import { GlobalWorkspaceInvitationsQueryOptionsDTO } from '../dto/global-workspace-invitations-query-options.dto.ts'
import { WorkspaceInvitationStatus } from '@/core/enums/workspace-invitation-status.enum.ts'

export interface IWorkspaceInvitationRepository {
    save(invitation: WorkspaceInvitation): Promise<void>
    findById(id: string): Promise<WorkspaceInvitation | null>
    findAll(queryOptions: GlobalWorkspaceInvitationsQueryOptionsDTO): Promise<PaginationResponse<WorkspaceInvitation>>
    countByWorkspaceIdEmailAndStatus(workspaceId: string, email: string, status: WorkspaceInvitationStatus[]): Promise<number>
}