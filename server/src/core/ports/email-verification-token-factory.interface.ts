import { EmailVerificationToken } from '../entities/email-verification-token.entity.ts'
import { EmailVerificationTokenType } from '../enums/email-verification-token-type.enum.ts'

export type IEmailVerificationTokenFactory = {
    create(params: {
        userId: string
        type: EmailVerificationTokenType
        expiresAt: Date
        newEmail?: string
    }): Promise<{ token: EmailVerificationToken, rawToken: string }>
}