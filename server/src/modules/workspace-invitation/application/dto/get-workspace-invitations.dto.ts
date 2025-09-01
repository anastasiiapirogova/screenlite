import { GetGlobalWorkspaceInvitationsDTO } from './get-global-workspace-invitations.dto.ts'

export type GetWorkspaceInvitationsDTO = GetGlobalWorkspaceInvitationsDTO & {
    filters: {
        workspaceId: string
    }
}