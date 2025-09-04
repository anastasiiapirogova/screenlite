import { ForbiddenError } from '@/shared/errors/forbidden.error.ts'
import { ITwoFactorMethodRepository } from '../ports/two-factor-method-repository.interface.ts'
import { TwoFactorMethodType } from '@/core/enums/two-factor-method-type.enum.ts'

export class TwoFactorMethodInvariantsService {
    constructor(private readonly twoFactorMethodRepo: ITwoFactorMethodRepository) {}

    async enforceTotpMethodIsNotEnabled(userId: string) {
        const twoFactorMethod = await this.twoFactorMethodRepo.findByUserIdAndType(userId, TwoFactorMethodType.TOTP)

        if (twoFactorMethod?.enabled) {
            throw new ForbiddenError({
                code: 'TOTP_METHOD_ALREADY_ENABLED',
                details: {
                    userId: ['TOTP_METHOD_ALREADY_ENABLED']
                }
            })
        }
    }
}