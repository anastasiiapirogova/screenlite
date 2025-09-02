import { Prisma, PrismaClient } from '@/generated/prisma/client.ts'
import { IInitiatorRepository } from '../../domain/ports/initiator-repository.interface.ts'
import { Initiator } from '@/core/entities/initiator.entity.ts'
import { PrismaInitiatorMapper } from '../mappers/prisma-initiator.mapper.ts'
import { InitiatorType } from '@/core/enums/initiator-type.enum.ts'

export class PrismaInitiatorRepository implements IInitiatorRepository {
    constructor(private readonly prisma: PrismaClient | Prisma.TransactionClient) {}

    async findByUserId(userId: string): Promise<Initiator | null> {
        const initiatorData = await this.prisma.initiator.findUnique({
            where: { userId },
            include: {
                user: true,
            },
        })

        if (!initiatorData) return null

        return PrismaInitiatorMapper.toDomain(initiatorData)
    }

    async findSystemInitiator(): Promise<Initiator | null> {
        const initiatorData = await this.prisma.initiator.findFirst({
            where: { type: InitiatorType.System },
            include: {
                user: true,
            },
        })

        if (!initiatorData) return null

        return PrismaInitiatorMapper.toDomain(initiatorData)
    }

    async findGuestInitiator(): Promise<Initiator | null> {
        const initiatorData = await this.prisma.initiator.findFirst({
            where: { type: InitiatorType.Guest },
            include: {
                user: true,
            },
        })

        if (!initiatorData) return null

        return PrismaInitiatorMapper.toDomain(initiatorData)
    }

    async save(initiator: Initiator): Promise<void> {
        const initiatorData = PrismaInitiatorMapper.toPersistence(initiator)

        await this.prisma.initiator.upsert({
            where: { id: initiator.id },
            create: initiatorData,
            update: initiatorData,
        })
    }

    async findById(id: string): Promise<Initiator | null> {
        const initiatorData = await this.prisma.initiator.findUnique({
            where: { id },
            include: {
                user: true,
            },
        })

        if (!initiatorData) return null

        return PrismaInitiatorMapper.toDomain(initiatorData)
    }
}