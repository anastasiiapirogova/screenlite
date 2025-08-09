import { Prisma, PrismaClient } from '@/generated/prisma/client.ts'
import { TwoFactorConfigPersistenceHandler } from './two-factor-config-persistence-handler.interface.ts'
import { TwoFactorConfig } from '@/core/types/two-factor-config.type.ts'
import { TotpConfig } from '@/core/value-objects/totp-config.value-object.ts'

export class TotpConfigHandler implements TwoFactorConfigPersistenceHandler<Prisma.TwoFactorMethodGetPayload<{ include: { totpConfig: true } }>> {
    constructor(private readonly prisma: PrismaClient | Prisma.TransactionClient) {}

    async saveConfig(twoFactorMethodId: string, config: TwoFactorConfig): Promise<void> {
        await this.prisma.totpConfig.upsert({
            where: { twoFactorMethodId },
            update: config,
            create: {
                ...config,
                twoFactorMethodId,
            },
        })
    }

    includeConfig(): Prisma.TwoFactorMethodInclude {
        return {
            totpConfig: true,
        }
    }

    extractConfig(persisted: Prisma.TwoFactorMethodGetPayload<{ include: { totpConfig: true } }>): TotpConfig | null {
        if (!persisted.totpConfig) {
            return null
        }

        return new TotpConfig(persisted.totpConfig.encryptedSecret, persisted.totpConfig.algorithm, persisted.totpConfig.digits, persisted.totpConfig.period)
    }
}
