import { EmailVerificationToken } from '../entities/email-verification-token.entity.ts'
import { EmailVerificationTokenType } from '../enums/email-verification-token-type.enum.ts'

export type IEmailVerificationTokenRepository = {
    create(token: EmailVerificationToken): Promise<void>
    findByTokenHash(tokenHash: string): Promise<EmailVerificationToken | null>
    deleteByEmail(email: string, type?: EmailVerificationTokenType): Promise<void>
    deleteAllByUserId(userId: string, type?: EmailVerificationTokenType): Promise<void>
    findLatestByUserId(userId: string, type: EmailVerificationTokenType): Promise<EmailVerificationToken | null>
}