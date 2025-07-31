import { Session } from '@/core/entities/session.entity.ts'
import { SessionTerminationReason } from '@/core/enums/session-termination-reason.enum.ts'
import { PrismaRepositorySessionMapper } from '@/core/mapper/prisma-session.mapper.ts'
import { ISessionRepository } from '@/core/ports/session-repository.interface.ts'
import { Prisma } from '@/generated/prisma/client.ts'
import { PrismaClient } from '@/generated/prisma/client.ts'

export class PrismaSessionRepository implements ISessionRepository {
    constructor(private readonly prisma: PrismaClient | Prisma.TransactionClient) {}

    async findById(id: string): Promise<Session | null> {
        const session = await this.prisma.session.findUnique({ where: { id } })

        return session ? PrismaRepositorySessionMapper.toDomain(session) : null
    }

    async findByTokenHash(tokenHash: string): Promise<Session | null> {
        const session = await this.prisma.session.findUnique({ where: { tokenHash } })

        return session ? PrismaRepositorySessionMapper.toDomain(session) : null
    }

    async findActiveByTokenHash(tokenHash: string): Promise<Session | null> {
        const session = await this.prisma.session.findFirst({
            where: {
                tokenHash,
                terminatedAt: null,
            }
        })
  
        return session ? PrismaRepositorySessionMapper.toDomain(session) : null
    }

    async save(session: Session): Promise<void> {
        const sessionData = PrismaRepositorySessionMapper.toPersistence(session)

        await this.prisma.session.upsert({
            where: { id: sessionData.id },
            create: sessionData,
            update: {
                ...sessionData,
                version: {
                    increment: 1,
                },
            },
        })
    }

    async terminateByUserId(userId: string, terminationReason: SessionTerminationReason, exceptIds: string[] = []): Promise<void> {
        await this.prisma.session.updateMany({
            where: {
                id: { notIn: exceptIds },
                userId,
                terminatedAt: null,
            },
            data: { terminatedAt: new Date(), terminationReason }
        })
    }

    async updateActivity(sessionId: string): Promise<void> {
        await this.prisma.session.update({
            where: { id: sessionId },
            data: { lastActivityAt: new Date() }
        })
    }
}