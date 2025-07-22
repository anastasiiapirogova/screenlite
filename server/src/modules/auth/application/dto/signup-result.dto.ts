import { User } from '@/core/entities/user.entity.ts'

export type SignupResultDTO = {
    user: User
    token: string
}