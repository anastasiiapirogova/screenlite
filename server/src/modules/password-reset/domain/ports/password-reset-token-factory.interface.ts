import { PasswordResetToken } from '@/core/entities/password-reset-token.entity.ts'

export type IPasswordResetTokenFactory = {
    create(params: {
        userId: string
        expiresAt: Date
    }): Promise<{ passwordResetToken: PasswordResetToken, rawToken: string }>
}