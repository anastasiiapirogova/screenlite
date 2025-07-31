import { EmailVerificationToken } from '../entities/email-verification-token.entity.ts'
import { EmailVerificationToken as PrismaEmailVerificationToken } from '@/generated/prisma/client.ts'

export class PrismaEmailVerificationTokenMapper {
    static toDomain(token: PrismaEmailVerificationToken): EmailVerificationToken {
        return new EmailVerificationToken({
            id: token.id,
            userId: token.userId,
            tokenHash: token.tokenHash,
            type: token.type,
            expiresAt: token.expiresAt,
            newEmail: token.newEmail,
            createdAt: token.createdAt,
        })
    }

    static toPersistence(token: EmailVerificationToken): Omit<PrismaEmailVerificationToken, 'createdAt'> {
        return {
            id: token.id,
            userId: token.userId,
            tokenHash: token.tokenHash,
            type: token.type,
            expiresAt: token.expiresAt,
            newEmail: token.newEmail,
        }
    }
}