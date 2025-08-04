import { v4 as uuidv4 } from 'uuid'
import { TwoFactorMethod } from '../../../../core/entities/two-factor-method.entity.ts'
import { TwoFactorMethodType } from '../../../../core/enums/two-factor-method-type.enum.ts'
import { TwoFactorConfig } from '../../../../core/types/two-factor-config.type.ts'
import { TotpConfig } from '../../../../core/value-objects/totp-config.value-object.ts'

export type CreateTwoFactorMethodData = {
    userId: string
    type: TwoFactorMethodType
    config: TwoFactorConfig
    enabled?: boolean
}

export class TwoFactorMethodFactory {
    static create(data: CreateTwoFactorMethodData): TwoFactorMethod {
        this.validateMethodData(data)

        return new TwoFactorMethod(
            uuidv4(),
            data.userId,
            data.type,
            data.enabled ?? false,
            data.config,
            null,
            new Date(),
        )
    }

    private static validateMethodData(methodData: CreateTwoFactorMethodData): void {
        if (!methodData.userId) {
            throw new Error('User ID is required')
        }

        if (!methodData.type) {
            throw new Error('Method type is required')
        }

        if (!methodData.config) {
            throw new Error('Config is required')
        }

        switch (methodData.type) {
            case TwoFactorMethodType.TOTP:
                this.validateTotpConfig(methodData.config)
                break
            default:
                throw new Error(`Unsupported method type: ${methodData.type}`)
        }
    }

    private static validateTotpConfig(config: TwoFactorConfig): void {
        if (!(config instanceof TotpConfig)) {
            throw new Error('TOTP config must be an instance of TotpConfig')
        }
    }
} 