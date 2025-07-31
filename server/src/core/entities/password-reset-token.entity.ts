import { PasswordResetTokenDTO } from '../dto/password-reset-token.dto.ts'

export class PasswordResetToken {
    public readonly id: string
    public readonly tokenHash: string
    public readonly userId: string
    public readonly expiresAt: Date
    public readonly createdAt: Date

    constructor(
        data: PasswordResetTokenDTO
    ) {
        this.id = data.id
        this.tokenHash = data.tokenHash
        this.userId = data.userId
        this.expiresAt = data.expiresAt
        this.createdAt = data.createdAt
    }

    isExpired(): boolean {
        return this.expiresAt < new Date()
    }

    isValid(): boolean {
        return !this.isExpired()
    }

    isRecentlyRequested(cooldown: number): boolean {
        return this.createdAt > new Date(Date.now() - cooldown)
    }
}