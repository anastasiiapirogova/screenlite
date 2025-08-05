import { TwoFactorMethod } from '@/core/entities/two-factor-method.entity.ts'
import { TwoFactorMethodType } from '@/core/enums/two-factor-method-type.enum.ts'
import { TwoFactorConfig } from '@/core/types/two-factor-config.type.ts'
import { TotpConfig } from '@/core/value-objects/totp-config.value-object.ts'
import { TwoFactorMethod as PrismaTwoFactorMethod } from '@/generated/prisma/client.ts'

type ConfigData = {
    totpConfig: TotpConfig | null
}

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

        const twoFactorMethodData = {
            id,
            userId,
            type,
            enabled,
            lastUsedAt,
            createdAt,
        }

        const configData: ConfigData = {
            totpConfig: null
        }

        switch (type) {
            case TwoFactorMethodType.TOTP:
                configData.totpConfig = config
                break
            default:
                throw new Error(`Unsupported two-factor method type: ${type}`)
        }

        return {
            twoFactorMethodData,
            configData,
        }
    }
}
