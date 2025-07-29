import { AuthContext } from '@/core/context/auth-context.abstract.ts'

export type CancelAccountDeletionDTO = {
    userId: string
    requester: AuthContext
} 