import { EmailVerificationToken } from '../entities/email-verification-token.entity.ts'
import { EmailVerificationTokenType } from '../enums/email-verification-token-type.enum.ts'

export type IEmailVerificationTokenRepository = {
    create(token: EmailVerificationToken): Promise<void>
    findByTokenHash(tokenHash: string): Promise<EmailVerificationToken | null>
    deleteForEmail(email: string, type?: EmailVerificationTokenType): Promise<void>
    deleteAllForUser(userId: string, type?: EmailVerificationTokenType): Promise<void>
    findLatestForUser(userId: string, type: EmailVerificationTokenType): Promise<EmailVerificationToken | null>
}