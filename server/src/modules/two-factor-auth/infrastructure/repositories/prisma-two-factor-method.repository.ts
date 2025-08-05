import { Prisma, PrismaClient } from '@/generated/prisma/client.ts'
import { ITwoFactorMethodRepository } from '../../domain/ports/two-factor-method-repository.interface.ts'
import { PrismaRepositoryTwoFactorMethodMapper } from '../mappers/prisma-repository-two-factor-method.mapper.ts'
import { TwoFactorMethod } from '@/core/entities/two-factor-method.entity.ts'
import { ITwoFactorConfigHandlerFactory } from '../../domain/ports/two-factor-config-handler-factory.interface.ts'
import { TwoFactorMethodType } from '@/core/enums/two-factor-method-type.enum.ts'

export class PrismaTwoFactorMethodRepository implements ITwoFactorMethodRepository {
    constructor(
        private readonly prisma: PrismaClient | Prisma.TransactionClient,
        private readonly twoFactorConfigHandlerFactory: ITwoFactorConfigHandlerFactory
    ) {}

    async save(twoFactorMethod: TwoFactorMethod): Promise<void> {
        const { twoFactorMethod: twoFactorMethodData, config } = PrismaRepositoryTwoFactorMethodMapper.toPersistence(twoFactorMethod)

        const where: Prisma.TwoFactorMethodWhereUniqueInput = {
            id: twoFactorMethod.id,
        }

        await this.prisma.twoFactorMethod.upsert({
            where,
            update: twoFactorMethodData,
            create: twoFactorMethodData,
        })

        const handler = this.twoFactorConfigHandlerFactory.getHandler(twoFactorMethod.type)

        if (handler) {
            await handler.saveConfig(twoFactorMethod.id, config)
        }
    }

    async findByUserId(userId: string): Promise<TwoFactorMethod[]> {
        const allIncludes = this.twoFactorConfigHandlerFactory.getAllIncludes()

        const where: Prisma.TwoFactorMethodWhereInput = {
            userId,
        }

        const methods = await this.prisma.twoFactorMethod.findMany({
            where,
            include: allIncludes,
        })

        return methods
            .map((method) => {
                const handler = this.twoFactorConfigHandlerFactory.getHandler(method.type as TwoFactorMethodType)
                const config = handler ? handler.extractConfig(method) : null

                return PrismaRepositoryTwoFactorMethodMapper.toDomain(method, config)
            })
            .filter((m): m is TwoFactorMethod => m !== null)
    }

    async findByUserIdAndType(userId: string, type: TwoFactorMethodType): Promise<TwoFactorMethod | null> {
        const handler = this.twoFactorConfigHandlerFactory.getHandler(type)
    
        const where: Prisma.TwoFactorMethodWhereInput = {
            userId,
            type,
        }
    
        const methods = await this.prisma.twoFactorMethod.findMany({
            where,
            include: handler ? handler.includeConfig() : {},
        })
    
        for (const method of methods) {
            if (!handler) continue
    
            const config = handler.extractConfig(method)

            if (config) {
                return PrismaRepositoryTwoFactorMethodMapper.toDomain(method, config)
            }
        }
    
        return null
    }

    async delete(twoFactorMethodId: string): Promise<void> {
        await this.prisma.twoFactorMethod.delete({
            where: { id: twoFactorMethodId },
        })
    }
}
