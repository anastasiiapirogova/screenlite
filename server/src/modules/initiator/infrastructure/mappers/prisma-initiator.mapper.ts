import { Initiator as PrismaInitiator } from '@/generated/prisma/client.ts'
import { Initiator } from '@/core/entities/initiator.entity.ts'
import { InitiatorType } from '@/core/enums/initiator-type.enum.ts'

export class PrismaInitiatorMapper {
    static toDomain(prismaInitiator: PrismaInitiator): Initiator {
        return new Initiator({
            id: prismaInitiator.id,
            type: prismaInitiator.type as InitiatorType,
            userId: prismaInitiator.userId,
        })
    }

    static toPersistence(initiator: Initiator): PrismaInitiator {
        return {
            id: initiator.id,
            type: initiator.type as InitiatorType,
            userId: initiator.userId,
        }
    }
}