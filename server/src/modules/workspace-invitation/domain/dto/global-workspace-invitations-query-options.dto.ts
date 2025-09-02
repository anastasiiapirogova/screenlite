import { WorkspaceInvitationStatus } from '@/core/enums/workspace-invitation-status.enum.ts'
import { WorkspaceStatus } from '@/core/enums/workspace-status.enum.ts'
import { PaginationParams } from '@/core/types/pagination.types.ts'

export type GlobalWorkspaceInvitationsQueryOptionsDTO = {
    filters?: {
        email?: string
        status?: WorkspaceInvitationStatus[]
        workspaceId?: string
        workspaceStatus?: WorkspaceStatus[]
    }
    pagination?: PaginationParams
}