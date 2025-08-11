import { Session } from '@/core/entities/session.entity.ts'
import { SessionTerminationReason } from '@/core/enums/session-termination-reason.enum.ts'
import { PrismaRepositorySessionMapper } from '@/modules/session/infrastructure/mappers/prisma-session.mapper.ts'
import { ISessionRepository } from '@/modules/session/domain/ports/session-repository.interface.ts'
import { Prisma } from '@/generated/prisma/client.ts'
import { PrismaClient } from '@/generated/prisma/client.ts'
import { SessionsQueryOptionsDTO } from '../../domain/dto/sessions-query-options.dto.ts'
import { PaginationResponse } from '@/core/types/pagination.types.ts'
import { Paginator } from '@/shared/utils/pagination.util.ts'
import { Session as PrismaSession } from '@/generated/prisma/client.ts'

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

    private toPersistence(session: Session): Omit<PrismaSession, 'createdAt' | 'updatedAt'> {
        return PrismaRepositorySessionMapper.toPersistence(session)
    }

    private toDomain(prismaSession: PrismaSession): Session {
        return PrismaRepositorySessionMapper.toDomain(prismaSession)
    }

    async findAll(options?: SessionsQueryOptionsDTO): Promise<PaginationResponse<Session>> {
        const terminatedAtFilters: Prisma.SessionWhereInput[] = []

        if(options?.filters?.onlyTerminated) {
            terminatedAtFilters.push({ terminatedAt: { not: null } })
        }

        if(options?.filters?.onlyActive) {
            terminatedAtFilters.push({ terminatedAt: null })
        }

        const where: Prisma.SessionWhereInput = {
            ...(options?.filters?.userId && { userId: options.filters.userId }),
            ...(terminatedAtFilters.length > 0 && { OR: terminatedAtFilters }),
        }

        const orderBy: Prisma.SessionOrderByWithRelationInput = {
            lastActivityAt: 'desc',
        }

        const findManyFn = (skip: number, take: number) => this.prisma.session.findMany({ where, skip, take, orderBy })
        const countFn = () => this.prisma.session.count({ where })

        const result = await Paginator.paginate(findManyFn, countFn, options?.pagination)

        return {
            items: result.items.map(this.toDomain),
            meta: result.meta,
        }
    }
}