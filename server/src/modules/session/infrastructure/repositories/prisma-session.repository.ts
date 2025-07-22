import { Session } from '@/core/entities/session.entity.ts'
import { ISessionRepository } from '@/core/ports/session-repository.interface.ts'
import { Session as PrismaSession } from '@/generated/prisma/client.ts'
import { PrismaClient } from '@/generated/prisma/client.ts'
import { ITransactionClient } from '@/core/ports/transaction-client.interface.ts'

export class PrismaSessionRepository implements ISessionRepository {
    constructor(private readonly prisma: PrismaClient) {}

    async findById(id: string): Promise<Session | null> {
        const session = await this.prisma.session.findUnique({ where: { id } })

        return session ? this.toDomain(session) : null
    }

    async findByToken(token: string): Promise<Session | null> {
        const session = await this.prisma.session.findUnique({ where: { token } })

        return session ? this.toDomain(session) : null
    }

    async save(session: Session): Promise<void> {
        await this.saveWithTransaction(session, this.prisma)
    }

    async saveWithTransaction(session: Session, tx: ITransactionClient): Promise<void> {
        const sessionData = this.toPersistence(session)

        await tx.session.upsert({
            where: { id: sessionData.id },
            create: sessionData,
            update: sessionData,
        })
    }

    async terminateAll(userId: string): Promise<void> {
        await this.terminateAllWithTransaction(userId, this.prisma)
    }

    async terminateAllWithTransaction(userId: string, tx: ITransactionClient): Promise<void> {
        await tx.session.updateMany({
            where: { 
                userId, 
                terminatedAt: null 
            },
            data: { terminatedAt: new Date() }
        })
    }

    async terminateAllExcept(userId: string, exceptToken: string): Promise<void> {
        await this.terminateAllExceptWithTransaction(userId, exceptToken, this.prisma)
    }

    async terminateAllExceptWithTransaction(
        userId: string, 
        exceptToken: string,
        tx: ITransactionClient
    ): Promise<void> {
        await tx.session.updateMany({
            where: { 
                userId, 
                terminatedAt: null,
                NOT: { token: exceptToken }
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
            token: prismaSession.token,
            userAgent: prismaSession.userAgent,
            ipAddress: prismaSession.ipAddress,
            location: prismaSession.location,
            terminatedAt: prismaSession.terminatedAt,
            lastActivityAt: prismaSession.lastActivityAt,
            twoFaVerifiedAt: prismaSession.twoFaVerifiedAt,
        })
    }

    private toPersistence(session: Session): Omit<PrismaSession, 'createdAt'> {
        const dto = session.toDTO()

        return {
            id: dto.id,
            userId: dto.userId,
            token: dto.token,
            userAgent: dto.userAgent,
            ipAddress: dto.ipAddress,
            location: dto.location,
            terminatedAt: dto.terminatedAt,
            lastActivityAt: dto.lastActivityAt,
            twoFaVerifiedAt: dto.twoFaVerifiedAt,
        }
    }
}