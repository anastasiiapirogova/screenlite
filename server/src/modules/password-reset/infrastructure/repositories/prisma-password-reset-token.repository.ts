import { IPasswordResetTokenRepository } from '@/modules/password-reset/domain/ports/password-reset-token-repository.interface.ts'
import { Prisma, PrismaClient } from '@/generated/prisma/client.ts'
import { PrismaPasswordResetTokenMapper } from '@/modules/password-reset/infrastructure/mappers/prisma-password-reset-token.mapper.ts'
import { PasswordResetToken } from '@/core/entities/password-reset-token.entity.ts'

export class PrismaPasswordResetTokenRepository implements IPasswordResetTokenRepository {
    constructor(private readonly prisma: PrismaClient | Prisma.TransactionClient) {}

    async save(token: PasswordResetToken): Promise<void> {
        const data = PrismaPasswordResetTokenMapper.toPersistence(token)

        const where: Prisma.PasswordResetTokenUpsertArgs['where'] = {
            id: data.id,
        }

        await this.prisma.passwordResetToken.upsert({
            where,
            create: data,
            update: data,
        })
    }

    async findByTokenHash(tokenHash: string): Promise<PasswordResetToken | null> {
        const passwordResetToken = await this.prisma.passwordResetToken.findUnique({
            where: {
                tokenHash
            },
        })

        return passwordResetToken ? PrismaPasswordResetTokenMapper.toDomain(passwordResetToken) : null
    }

    async findLatestByUserId(userId: string): Promise<PasswordResetToken | null> {
        const passwordResetToken = await this.prisma.passwordResetToken.findFirst({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        })

        return passwordResetToken ? PrismaPasswordResetTokenMapper.toDomain(passwordResetToken) : null
    }

    async deleteAllByUserId(userId: string): Promise<void> {
        await this.prisma.passwordResetToken.deleteMany({
            where: { userId },
        })
    }

    async delete(tokenId: string): Promise<void> {
        await this.prisma.passwordResetToken.delete({
            where: { id: tokenId },
        })
    }
}