import { ValidationError } from '@/shared/errors/validation.error.ts'
import { ITwoFactorMethodRepository } from '../../domain/ports/two-factor-method-repository.interface.ts'
import { TwoFactorMethodType } from '@/core/enums/two-factor-method-type.enum.ts'
import { TotpService } from '../../infrastructure/services/totp.service.ts'
import { TwoFactorMethod } from '@/core/entities/two-factor-method.entity.ts'
import { VerifyTotpCodeDTO } from '../dto/verify-totp-code.dto.ts'
import { IEncryptionService } from '@/core/ports/encryption-service.interface.ts'

type VerifyTotpCodeUsecaseDeps = {
    twoFactorMethodRepo: ITwoFactorMethodRepository
    encryptionService: IEncryptionService
}

/**
 * Verifies the TOTP code and returns the method if valid.
 * Only for internal application use — do not expose externally.
 */
export class VerifyTotpCodeUsecase {
    constructor(private readonly deps: VerifyTotpCodeUsecaseDeps) {}

    async execute(data: VerifyTotpCodeDTO): Promise<TwoFactorMethod> {
        const { userId, totpCode } = data

        const method = await this.deps.twoFactorMethodRepo.findByUserIdAndType(
            userId,
            TwoFactorMethodType.TOTP
        )

        if (!method) {
            throw new ValidationError({
                userId: ['TWO_FACTOR_METHOD_NOT_FOUND'],
            })
        }

        const config = method.config
        const totpService = new TotpService()

        const decryptedSecret = await this.deps.encryptionService.decrypt(config.secret)

        const isValid = await totpService.verifyCode(
            decryptedSecret,
            totpCode,
            1,
            config.algorithm,
            config.digits,
            config.period
        )

        if (!isValid) {
            throw new ValidationError({
                totpCode: ['INVALID_TOTP_CODE'],
            })
        }

        return method
    }
}
