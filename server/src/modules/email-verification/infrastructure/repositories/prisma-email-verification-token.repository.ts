import { EmailVerificationToken } from '@/core/entities/email-verification-token.entity.ts'
import { IEmailVerificationTokenRepository } from '@/modules/email-verification/domain/ports/email-verification-token-repository.interface.ts'
import { Prisma } from '@/generated/prisma/client.ts'
import { PrismaClient } from '@/generated/prisma/internal/class.ts'
import { EmailVerificationTokenType } from '@/core/enums/email-verification-token-type.enum.ts'
import { PrismaEmailVerificationTokenMapper } from '@/modules/email-verification/infrastructure/mappers/prisma-email-verification-token.mapper.ts'

export class PrismaEmailVerificationTokenRepository implements IEmailVerificationTokenRepository {
    constructor(
        private readonly prisma: PrismaClient | Prisma.TransactionClient,
    ) {}
    async create(token: EmailVerificationToken): Promise<void> {
        const data = PrismaEmailVerificationTokenMapper.toPersistence(token)

        await this.prisma.emailVerificationToken.create({
            data,
        })
    }

    async findByTokenHash(tokenHash: string): Promise<EmailVerificationToken | null> {
        const result = await this.prisma.emailVerificationToken.findUnique({
            where: {
                tokenHash,
            }
        })

        return result ? PrismaEmailVerificationTokenMapper.toDomain(result) : null
    }

    async deleteByEmail(email: string, type?: EmailVerificationTokenType): Promise<void> {
        await this.prisma.emailVerificationToken.deleteMany({
            where: {
                newEmail: email,
                type: type ?? Prisma.skip,
            }
        })
    }

    async deleteAllByUserId(userId: string, type?: EmailVerificationTokenType): Promise<void> {
        await this.prisma.emailVerificationToken.deleteMany({ 
            where: {
                userId,
                type,
            }
        })
    }

    async findLatestByUserId(userId: string, type: string): Promise<EmailVerificationToken | null> {
        const result = await this.prisma.emailVerificationToken.findFirst({
            where: {
                userId,
                type
            },
            orderBy: {
                createdAt: 'desc'
            },
        })

        return result ? PrismaEmailVerificationTokenMapper.toDomain(result) : null
    }
}