import { WorkspaceInvitationStatus } from '@/core/enums/workspace-invitation-status.enum.ts'
import { AuthContext } from '@/core/types/auth-context.type.ts'
import { PaginationParams } from '@/core/types/pagination.types.ts'

export type GetUserWorkspaceInvitationsDTO = {
    userId: string
    authContext: AuthContext
    queryOptions: {
        filters: {
            status: WorkspaceInvitationStatus[]
        }
        pagination?: PaginationParams
    }
}