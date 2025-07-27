import { IAuthContext } from '@/core/ports/auth-context.interface.ts'

export type RequestAccountDeletionDTO = {
    userId: string
    requester: IAuthContext
    currentSessionTokenHash?: string
}