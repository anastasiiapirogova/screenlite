import { AuthContext } from '@/core/types/auth-context.type.ts'
import { ITwoFactorMethodRepository } from '../../domain/ports/two-factor-method-repository.interface.ts'
import { ITotpService } from '../../domain/ports/totp-service.interface.ts'
import { TwoFactorMethodType } from '@/core/enums/two-factor-method-type.enum.ts'
import { IConfig } from '@/infrastructure/config/config.interface.ts'
import { IEncryptionService } from '@/core/ports/encryption-service.interface.ts'
import { IUserRepository } from '@/modules/user/domain/ports/user-repository.interface.ts'
import { TwoFactorAuthPolicy } from '../../domain/policies/two-factor-auth.policy.ts'
import { ForbiddenError } from '@/shared/errors/forbidden.error.ts'
import { ValidationError } from '@/shared/errors/validation.error.ts'
import { IUnitOfWork } from '@/core/ports/unit-of-work.interface.ts'
import { ITotpSetupService } from '../../domain/ports/totp-setup-service.interface.ts'

type GetTotpSetupDataUsecaseDeps = {
    twoFactorMethodRepo: ITwoFactorMethodRepository
    totpService: ITotpService
    config: IConfig
    encryptionService: IEncryptionService
    userRepo: IUserRepository
    unitOfWork: IUnitOfWork
    totpSetupService: ITotpSetupService
}

export class GetTotpSetupDataUsecase {
    constructor(private readonly deps: GetTotpSetupDataUsecaseDeps) {}
  
    async execute(authContext: AuthContext, userId: string) {
        const { twoFactorMethodRepo, totpService, userRepo, unitOfWork, totpSetupService } = this.deps
  
        const user = await userRepo.findById(userId)

        if (!user) {
            throw new ValidationError({ userId: ['USER_NOT_FOUND'] })
        }
  
        TwoFactorAuthPolicy.enforceViewTotpSetupData(userId, authContext)
  
        let twoFactorMethod = await twoFactorMethodRepo.findByUserIdAndType(
            userId,
            TwoFactorMethodType.TOTP
        )
  
        let secret: string | null = null
  
        if (!twoFactorMethod) {
            const result = await unitOfWork.execute(async (repos) => {
                return await totpSetupService.createTotpMethod(
                    userId,
                    repos.twoFactorMethodRepository
                )
            })

            twoFactorMethod = result.method
            secret = result.secret
        }
  
        if (twoFactorMethod.enabled) {
            throw new ForbiddenError({
                code: 'TOTP_ALREADY_ENABLED_CANNOT_VIEW_SECRET',
                details: { totp: ['TOTP_ALREADY_ENABLED_CANNOT_VIEW_SECRET'] }
            })
        }
  
        if (!secret) {
            secret = await this.deps.encryptionService.decrypt(
                twoFactorMethod.config.encryptedSecret
            )
        }
  
        const url = totpService.generateQrCodeUrl(
            secret,
            user.email.current,
            'Screenlite',
            this.deps.config.totp.digits,
            this.deps.config.totp.period,
            this.deps.config.totp.algorithm
        )
  
        return {
            secret,
            totpConfig: twoFactorMethod.config,
            url
        }
    }
}