import { AuthContext } from '@/core/types/auth-context.type.ts'

export type ChangePasswordDTO = {
    authContext: AuthContext
    userId: string
    password: string
    currentPassword: string
}