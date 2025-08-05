import { TwoFactorMethodType } from '@/core/enums/two-factor-method-type.enum.ts'
import { TwoFactorConfig } from '@/core/types/two-factor-config.type.ts'

export type TwoFactorMethodDto = {
    id: string
    userId: string
    type: TwoFactorMethodType
    enabled: boolean
    config: TwoFactorConfig
    lastUsedAt: Date | null
    createdAt: Date
}