import { AuthContext } from '@/core/types/auth-context.type.ts'

export interface RespondToWorkspaceInvitationDTO {
    invitationId: string
    accept: boolean
    authContext: AuthContext
}