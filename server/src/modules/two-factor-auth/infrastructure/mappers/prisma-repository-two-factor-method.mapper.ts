import { TwoFactorMethod } from '@/core/entities/two-factor-method.entity.ts'
import { TwoFactorMethodType } from '@/core/enums/two-factor-method-type.enum.ts'
import { TwoFactorConfig } from '@/core/types/two-factor-config.type.ts'
import { TwoFactorMethod as PrismaTwoFactorMethod } from '@/generated/prisma/client.ts'

export class PrismaRepositoryTwoFactorMethodMapper {
    static toDomain(
        prismaTwoFactorMethod: PrismaTwoFactorMethod,
        twoFactorConfig: TwoFactorConfig | null,
    ): TwoFactorMethod | null {
        const type = prismaTwoFactorMethod.type as TwoFactorMethodType
    
        if (!twoFactorConfig) {
            console.error(`[TwoFactorMethodMapper] Missing config for method ID ${prismaTwoFactorMethod.id}`)

            return null
        }
    
        return new TwoFactorMethod({
            id: prismaTwoFactorMethod.id,
            userId: prismaTwoFactorMethod.userId,
            type,
            enabled: prismaTwoFactorMethod.enabled,
            config: twoFactorConfig,
            lastUsedAt: prismaTwoFactorMethod.lastUsedAt,
            createdAt: prismaTwoFactorMethod.createdAt,
        })
    }

    static toPersistence(
        twoFactorMethod: TwoFactorMethod,
    ) {
        const { id, userId, type, enabled, lastUsedAt, createdAt, config } = twoFactorMethod

        return {
            twoFactorMethod: {
                id,
                userId,
                type,
                enabled,
                lastUsedAt,
                createdAt,
                isTotp: type === TwoFactorMethodType.TOTP,
            },
            config
        }
    }
}
