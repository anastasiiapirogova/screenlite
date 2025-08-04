import { Prisma, PrismaClient } from '@/generated/prisma/client.ts'
import { ITwoFactorMethodRepository } from '@/modules/two-factor-auth/domain/ports/two-factor-method-repository.interface.ts'
import { TwoFactorMethod } from '@/core/entities/two-factor-method.entity.ts'
import { TwoFactorMethodType } from '@/core/enums/two-factor-method-type.enum.ts'
import { PrismaRepositoryTwoFactorMethodMapper } from '../mappers/prisma-repository-two-factor-method.mapper.ts'

export class PrismaTwoFactorMethodRepository implements ITwoFactorMethodRepository {
    constructor(private readonly prisma: PrismaClient | Prisma.TransactionClient) {}

    async save(twoFactorMethod: TwoFactorMethod): Promise<void> {
        const { twoFactorMethodData, configData } = PrismaRepositoryTwoFactorMethodMapper.toPersistence(twoFactorMethod)
        
        await this.prisma.twoFactorMethod.upsert({
            where: {
                id: twoFactorMethod.id
            },
            update: twoFactorMethodData,
            create: twoFactorMethodData,
        })

        if (twoFactorMethod.type === TwoFactorMethodType.TOTP && configData.totpConfig) {
            await this.prisma.totpConfig.upsert({
                where: {
                    twoFactorMethodId: twoFactorMethod.id
                },
                update: configData.totpConfig,
                create: {
                    ...configData.totpConfig,
                    twoFactorMethodId: twoFactorMethod.id,
                },
            })
        }
    }

    async findByUserId(userId: string): Promise<TwoFactorMethod[]> {
        const methods = await this.prisma.twoFactorMethod.findMany({
            where: {
                userId
            },
            include: {
                totpConfig: true,
            },
        })

        return methods.map(method => PrismaRepositoryTwoFactorMethodMapper.toDomain(method, method.totpConfig)).filter(method => method !== null)
    }

    async findByUserIdAndType(userId: string, type: TwoFactorMethodType): Promise<TwoFactorMethod | null> {
        const method = await this.prisma.twoFactorMethod.findFirst({
            where: {
                userId,
                type,
            },
            include: {
                totpConfig: true,
            },
        })

        return method ? PrismaRepositoryTwoFactorMethodMapper.toDomain(method, method.totpConfig) : null
    }

    async delete(twoFactorMethodId: string): Promise<void> {
        await this.prisma.twoFactorMethod.delete({
            where: { id: twoFactorMethodId },
        })
    }
}