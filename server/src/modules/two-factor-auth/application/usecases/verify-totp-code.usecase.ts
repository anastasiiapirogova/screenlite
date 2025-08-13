import { ValidationError } from '@/shared/errors/validation.error.ts'
import { ITwoFactorMethodRepository } from '../../domain/ports/two-factor-method-repository.interface.ts'
import { TwoFactorMethodType } from '@/core/enums/two-factor-method-type.enum.ts'
import { TwoFactorMethod } from '@/core/entities/two-factor-method.entity.ts'
import { VerifyTotpCodeDTO } from '../dto/verify-totp-code.dto.ts'
import { IEncryptionService } from '@/core/ports/encryption-service.interface.ts'
import { ITotpService } from '../../domain/ports/totp-service.interface.ts'

type VerifyTotpCodeUsecaseDeps = {
    twoFactorMethodRepo: ITwoFactorMethodRepository
    encryptionService: IEncryptionService
    totpService: ITotpService
}

/**
 * Verifies the TOTP code and returns the method if valid.
 * Only for internal application use — do not expose externally.
 */
export class VerifyTotpCodeUsecase {
    constructor(private readonly deps: VerifyTotpCodeUsecaseDeps) {}

    async execute(data: VerifyTotpCodeDTO): Promise<TwoFactorMethod> {
        const { totpService, encryptionService, twoFactorMethodRepo } = this.deps
        const { userId, totpCode } = data

        const method = await twoFactorMethodRepo.findByUserIdAndType(
            userId,
            TwoFactorMethodType.TOTP
        )

        if (!method) {
            throw new ValidationError({
                userId: ['TWO_FACTOR_METHOD_NOT_FOUND'],
            })
        }

        const config = method.config

        const decryptedSecret = await encryptionService.decrypt(config.encryptedSecret)

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
