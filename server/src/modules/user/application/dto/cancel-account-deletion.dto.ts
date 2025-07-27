import { IAuthContext } from '@/core/ports/auth-context.interface.ts'

export type CancelAccountDeletionDTO = {
    userId: string
    requester: IAuthContext
} 