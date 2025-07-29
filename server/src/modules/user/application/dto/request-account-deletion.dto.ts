import { AuthContext } from '@/core/context/auth-context.abstract.ts'

export type RequestAccountDeletionDTO = {
    userId: string
    requester: AuthContext
    currentSessionTokenHash?: string
}