import { AuthContext } from '@/core/types/auth-context.type.ts'

export type CancelAccountDeletionDTO = {
    userId: string
    authContext: AuthContext
} 