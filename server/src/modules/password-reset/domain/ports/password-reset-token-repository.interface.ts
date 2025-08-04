import { PasswordResetToken } from '../../../../core/entities/password-reset-token.entity.ts'

export interface IPasswordResetTokenRepository {
    save(token: PasswordResetToken): Promise<void>
    findByTokenHash(tokenHash: string): Promise<PasswordResetToken | null>
    findLatestByUserId(userId: string): Promise<PasswordResetToken | null>
    deleteAllByUserId(userId: string): Promise<void>
    delete(tokenId: string): Promise<void>
}