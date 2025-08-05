import { TwoFactorConfig } from '@/core/types/two-factor-config.type.ts'
import { Prisma } from '@/generated/prisma/client.ts'

export interface TwoFactorConfigPersistenceHandler<
    TExtractSource = unknown
> {
    saveConfig(twoFactorMethodId: string, config: TwoFactorConfig): Promise<void>
    includeConfig(): Prisma.TwoFactorMethodInclude
    extractConfig(persisted: TExtractSource): TwoFactorConfig | null
}