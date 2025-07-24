import { User } from '@/core/entities/user.entity.ts'

export type RequestAccountDeletionDTO = {
    userId: string
    requester: User
    currentSessionTokenHash?: string
}