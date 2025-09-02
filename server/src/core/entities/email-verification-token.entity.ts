import { EmailVerificationTokenDTO } from '../../shared/dto/email-verification-token.dto.ts'
import { EmailVerificationTokenType } from '../enums/email-verification-token-type.enum.ts'

export class EmailVerificationToken {
    public readonly id: string
    public readonly userId: string
    public readonly tokenHash: string
    public readonly type: string
    public readonly expiresAt: Date
    public readonly newEmail: string | null
    public readonly createdAt: Date

    constructor(dto: EmailVerificationTokenDTO) {
        this.id = dto.id
        this.userId = dto.userId
        this.tokenHash = dto.tokenHash
        this.type = dto.type
        this.expiresAt = dto.expiresAt
        this.newEmail = dto.newEmail
        this.createdAt = dto.createdAt
    }

    isValidVerifyToken(): boolean {
        return this.type === EmailVerificationTokenType.VERIFY && !this.isExpired()
    }

    isValidEmailChangeToken(): boolean {
        return this.type === EmailVerificationTokenType.EMAIL_CHANGE && !this.isExpired() && this.newEmail !== null
    }

    isExpired(): boolean {
        return this.expiresAt < new Date()
    }

    isRecentlyRequested(cooldown: number): boolean {
        return this.createdAt > new Date(Date.now() - cooldown)
    }
}