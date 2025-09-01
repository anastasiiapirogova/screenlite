import { AuthContext } from '@/core/types/auth-context.type.ts'

export type InviteToWorkspaceDTO = {
    workspaceId: string
    email: string
    authContext: AuthContext
}