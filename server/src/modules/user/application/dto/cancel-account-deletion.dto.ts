import { User } from '@/core/entities/user.entity.ts'

export type CancelAccountDeletionDTO = {
    userId: string
    requester: User
} 