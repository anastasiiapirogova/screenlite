import { AuthContext } from '@/core/types/auth-context.type.ts'

export type CreateWorkspaceDTO = {
    name: string
    slug: string
    authContext: AuthContext
}