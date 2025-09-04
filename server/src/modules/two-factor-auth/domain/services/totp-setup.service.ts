import { IEncryptionService } from '@/core/ports/encryption-service.interface.ts'
import { IConfig } from '@/infrastructure/config/config.interface.ts'
import { TwoFactorMethodType } from '@/core/enums/two-factor-method-type.enum.ts'
import { TotpConfig } from '@/core/value-objects/totp-config.vo.ts'
import { ForbiddenError } from '@/shared/errors/forbidden.error.ts'
import { ResourceConflictError } from '@/shared/errors/resource-conflict.error.ts'
import { TwoFactorMethod } from '@/core/entities/two-factor-method.entity.ts'
import { ITotpService } from '../ports/totp-service.interface.ts'
import { ITwoFactorMethodRepository } from '../ports/two-factor-method-repository.interface.ts'
import { TwoFactorMethodFactory } from './two-factor-method.factory.ts'

export class TotpSetupService {
    constructor(
        private readonly totpService: ITotpService,
        private readonly encryptionService: IEncryptionService,
        private readonly config: IConfig
    ) {}

    async createTotpMethod(
        userId: string,
        repository: ITwoFactorMethodRepository
    ): Promise<{ method: TwoFactorMethod, secret: string }> {
        const secret = this.totpService.generateSecret()
        const encryptedSecret = await this.encryptionService.encrypt(secret)

        const totpConfig = new TotpConfig(
            encryptedSecret,
            this.config.totp.algorithm,
            this.config.totp.digits,
            this.config.totp.period
        )

        const method = TwoFactorMethodFactory.create({
            userId,
            type: TwoFactorMethodType.TOTP,
            config: totpConfig,
            enabled: false
        })

        try {
            await repository.save(method)
            return { method, secret }
        } catch (error) {
            if (error instanceof ResourceConflictError) {
                throw new ForbiddenError({
                    details: { totp: ['TOTP_ALREADY_SETUP'] }
                })
            }
            throw error
        }
    }
}