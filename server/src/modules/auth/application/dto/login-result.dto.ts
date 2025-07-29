import { User } from '@/core/entities/user.entity.ts'

export type LoginResultDTO = {
    user: User
    token: string
}