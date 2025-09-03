import { AuthContext } from '@/core/types/auth-context.type.ts'

export type GetWorkspaceMemberByUserDTO = {
    workspaceId: string
    userId: string
    authContext: AuthContext
}
