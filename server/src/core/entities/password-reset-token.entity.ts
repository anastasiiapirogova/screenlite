import { PasswordResetTokenDTO } from '../dto/password-reset-token.dto.ts'

export class PasswordResetToken {
    public readonly id: string
    public readonly tokenHash: string
    public readonly userId: string
    public readonly expiresAt: Date

    constructor(
        data: PasswordResetTokenDTO
    ) {
        this.id = data.id
        this.tokenHash = data.tokenHash
        this.userId = data.userId
        this.expiresAt = data.expiresAt
    }
}