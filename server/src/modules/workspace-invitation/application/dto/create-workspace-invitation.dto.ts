import { AuthContext } from '@/core/types/auth-context.type.ts'

export type CreateWorkspaceInvitationDTO = {
    workspaceId: string
    email: string
    authContext: AuthContext
}