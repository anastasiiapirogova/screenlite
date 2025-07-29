import { EmailVerificationToken } from '@/core/entities/email-verification-token.entity.ts'
import { IEmailVerificationTokenRepository } from '@/core/ports/email-verification-token-repository.interface.ts'
import { Prisma, EmailVerificationToken as PrismaEmailVerificationToken } from '@/generated/prisma/client.ts'
import { PrismaClient } from '@/generated/prisma/internal/class.ts'
import { EmailVerificationTokenType } from '@/core/enums/email-verification-token-type.enum.ts'

export class PrismaEmailVerificationTokenRepository implements IEmailVerificationTokenRepository {
    constructor(
        private readonly prisma: PrismaClient | Prisma.TransactionClient,
    ) {}
    async create(token: EmailVerificationToken): Promise<void> {
        await this.prisma.emailVerificationToken.create({
            data: {
                ...this.toPersistence(token),
            }
        })
    }

    async findByTokenHash(tokenHash: string): Promise<EmailVerificationToken | null> {
        const result = await this.prisma.emailVerificationToken.findUnique({
            where: {
                tokenHash,
            }
        })

        return result ? this.toDomain(result) : null
    }

    async deleteForEmail(email: string, type?: EmailVerificationTokenType): Promise<void> {
        await this.prisma.emailVerificationToken.deleteMany({
            where: {
                newEmail: email,
                type: type ?? Prisma.skip,
            }
        })
    }

    async deleteAllForUser(userId: string, type?: EmailVerificationTokenType): Promise<void> {
        await this.prisma.emailVerificationToken.deleteMany({ 
            where: {
                userId,
                type,
            }
        })
    }

    async findLatestForUser(userId: string, type: string): Promise<EmailVerificationToken | null> {
        const result = await this.prisma.emailVerificationToken.findFirst({
            where: {
                userId,
                type
            },
            orderBy: {
                createdAt: 'desc'
            },
        })

        return result ? this.toDomain(result) : null
    }

    private toDomain(token: PrismaEmailVerificationToken): EmailVerificationToken {
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

    private toPersistence(token: EmailVerificationToken): PrismaEmailVerificationToken {
        const dto = token.toDTO()

        return {
            id: dto.id,
            userId: dto.userId,
            tokenHash: dto.tokenHash,
            type: dto.type,
            expiresAt: dto.expiresAt,
            newEmail: dto.newEmail,
            createdAt: dto.createdAt,
        }
    }
}