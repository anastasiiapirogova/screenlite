import { AuthContext } from '@/core/types/auth-context.type.ts'

export type RequestAccountDeletionDTO = {
    userId: string
    authContext: AuthContext
    currentSessionTokenHash?: string
}