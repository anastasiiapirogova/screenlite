import { WorkspaceInvitationStatus } from '@/core/enums/workspace-invitation-status.enum.ts'
import { PaginationParams } from '@/core/types/pagination.types.ts'

export type WorkspaceInvitationsByWorkspaceQueryOptionsDTO = {
    filters: {
        email?: string
        status?: WorkspaceInvitationStatus[]
        workspaceId: string
    }
    pagination?: PaginationParams
}