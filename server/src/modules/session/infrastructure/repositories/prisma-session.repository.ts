import { Session } from '@/core/entities/session.entity.ts'
import { ISessionRepository } from '@/core/ports/session-repository.interface.ts'
import { Prisma, Session as PrismaSession } from '@/generated/prisma/client.ts'
import { PrismaClient } from '@/generated/prisma/client.ts'

export class PrismaSessionRepository implements ISessionRepository {
    constructor(private readonly prisma: PrismaClient | Prisma.TransactionClient) {}

    async findById(id: string): Promise<Session | null> {
        const session = await this.prisma.session.findUnique({ where: { id } })

        return session ? this.toDomain(session) : null
    }

    async findByTokenHash(tokenHash: string): Promise<Session | null> {
        const session = await this.prisma.session.findUnique({ where: { tokenHash } })

        return session ? this.toDomain(session) : null
    }

    async findActiveByTokenHash(tokenHash: string): Promise<Session | null> {
        const session = await this.prisma.session.findFirst({
            where: {
                tokenHash,
                terminatedAt: null,
            }
        })
  
        return session ? this.toDomain(session) : null
    }

    async save(session: Session): Promise<void> {
        const sessionData = this.toPersistence(session)

        await this.prisma.session.upsert({
            where: { id: sessionData.id },
            create: sessionData,
            update: sessionData,
        })
    }

    async terminateAll(userId: string): Promise<void> {
        await this.prisma.session.updateMany({
            where: {
                userId,
                terminatedAt: null,
            },
            data: { terminatedAt: new Date() }
        })
    }

    async terminateAllExcept(userId: string, exceptTokenHash?: string): Promise<void> {
        await this.prisma.session.updateMany({
            where: { 
                userId, 
                terminatedAt: null,
                NOT: { tokenHash: exceptTokenHash }
            },
            data: { terminatedAt: new Date() }
        })
    }

    async updateActivity(sessionId: string): Promise<void> {
        await this.prisma.session.update({
            where: { id: sessionId },
            data: { lastActivityAt: new Date() }
        })
    }

    async verifyTwoFactor(sessionId: string): Promise<void> {
        await this.prisma.session.update({
            where: { id: sessionId },
            data: { twoFaVerifiedAt: new Date() }
        })
    }

    private toDomain(prismaSession: PrismaSession): Session {
        return new Session({
            id: prismaSession.id,
            userId: prismaSession.userId,
            tokenHash: prismaSession.tokenHash,
            userAgent: prismaSession.userAgent,
            ipAddress: prismaSession.ipAddress,
            location: prismaSession.location,
            terminatedAt: prismaSession.terminatedAt,
            lastActivityAt: prismaSession.lastActivityAt,
            twoFaVerifiedAt: prismaSession.twoFaVerifiedAt,
            terminationReason: prismaSession.terminationReason,
        })
    }

    private toPersistence(session: Session): Omit<PrismaSession, 'createdAt'> {
        const dto = session.toDTO()

        return {
            id: dto.id,
            userId: dto.userId,
            tokenHash: dto.tokenHash,
            userAgent: dto.userAgent,
            ipAddress: dto.ipAddress,
            location: dto.location,
            terminatedAt: dto.terminatedAt,
            lastActivityAt: dto.lastActivityAt,
            twoFaVerifiedAt: dto.twoFaVerifiedAt,
            terminationReason: dto.terminationReason,
        }
    }
}