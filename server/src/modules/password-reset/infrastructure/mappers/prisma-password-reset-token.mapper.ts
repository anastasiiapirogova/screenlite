import { PasswordResetToken as PrismaPasswordResetToken } from '@/generated/prisma/client.ts'
import { PasswordResetToken } from '../../../../core/entities/password-reset-token.entity.ts'

export class PrismaPasswordResetTokenMapper {
    static toDomain(prismaPasswordResetToken: PrismaPasswordResetToken): PasswordResetToken {
        return new PasswordResetToken(
            {
                id: prismaPasswordResetToken.id,
                tokenHash: prismaPasswordResetToken.tokenHash,
                userId: prismaPasswordResetToken.userId,
                expiresAt: prismaPasswordResetToken.expiresAt,
                createdAt: prismaPasswordResetToken.createdAt,
            }
        )
    }

    static toPersistence(passwordResetToken: PasswordResetToken): Omit<PrismaPasswordResetToken, 'createdAt'> {
        return {
            id: passwordResetToken.id,
            tokenHash: passwordResetToken.tokenHash,
            userId: passwordResetToken.userId,
            expiresAt: passwordResetToken.expiresAt,
        }
    }
}