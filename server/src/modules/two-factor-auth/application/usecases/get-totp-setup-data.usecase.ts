import { AuthContext } from '@/core/types/auth-context.type.ts'
import { ITwoFactorMethodRepository } from '../../domain/ports/two-factor-method-repository.interface.ts'
import { ITotpService } from '../../domain/ports/totp-service.interface.ts'
import { TwoFactorMethodFactory } from '../../domain/services/two-factor-method.factory.ts'
import { TwoFactorMethodType } from '@/core/enums/two-factor-method-type.enum.ts'
import { TotpConfig } from '@/core/value-objects/totp-config.vo.ts'
import { IConfig } from '@/infrastructure/config/config.interface.ts'
import { IEncryptionService } from '@/core/ports/encryption-service.interface.ts'
import { IUserRepository } from '@/modules/user/domain/ports/user-repository.interface.ts'
import { TwoFactorAuthPolicy } from '../../domain/policies/two-factor-auth.policy.ts'
import { ForbiddenError } from '@/shared/errors/forbidden.error.ts'
import { ValidationError } from '@/shared/errors/validation.error.ts'
import { IUnitOfWork } from '@/core/ports/unit-of-work.interface.ts'
import { ResourceConflictError } from '@/shared/errors/resource-conflict.error.ts'

type GetTotpSetupDataUsecaseDeps = {
    twoFactorMethodRepo: ITwoFactorMethodRepository
    totpService: ITotpService
    config: IConfig
    encryptionService: IEncryptionService
    userRepo: IUserRepository
    unitOfWork: IUnitOfWork
}

export class GetTotpSetupDataUsecase {
    constructor(
        private readonly deps: GetTotpSetupDataUsecaseDeps
    ) {}

    async execute(authContext: AuthContext, userId: string) {
        const { twoFactorMethodRepo, totpService, config, encryptionService, userRepo, unitOfWork } = this.deps

        const user = await userRepo.findById(userId)

        if (!user) {
            throw new ValidationError({
                userId: ['USER_NOT_FOUND']
            })
        }

        const twoFactorAuthPolicy = new TwoFactorAuthPolicy(user, authContext)

        twoFactorAuthPolicy.enforceViewTotpSetupData()

        let twoFactorMethod = await twoFactorMethodRepo.findByUserIdAndType(userId, TwoFactorMethodType.TOTP)

        if (twoFactorMethod?.enabled) {
            throw new ForbiddenError({
                details: {
                    totp: ['TOTP_ALREADY_ENABLED_CANNOT_VIEW_SECRET']
                }
            })
        }

        let secret: string | null = null

        if (!twoFactorMethod) {
            secret = totpService.generateSecret()

            const encryptedSecret = await encryptionService.encrypt(secret)

            const totpConfig = new TotpConfig(
                encryptedSecret,
                config.totp.algorithm,
                config.totp.digits,
                config.totp.period
            )

            twoFactorMethod = TwoFactorMethodFactory.create({
                userId,
                type: TwoFactorMethodType.TOTP,
                config: totpConfig,
                enabled: false
            })

            await unitOfWork.execute(async (repos) => {
                try {
                    await repos.twoFactorMethodRepository.save(twoFactorMethod!)
                } catch (error) {
                    if (error instanceof ResourceConflictError) {
                        throw new ForbiddenError({
                            details: {
                                totp: ['TOTP_ALREADY_SETUP']
                            }
                        })
                    }

                    throw error
                }
            })
        } else {
            secret = await encryptionService.decrypt(twoFactorMethod.config.encryptedSecret)
        }

        const url = totpService.generateQrCodeUrl(secret, user.email.current, 'Screenlite', config.totp.digits, config.totp.period, config.totp.algorithm)

        return {
            secret,
            totpConfig: twoFactorMethod.config,
            url
        }
    }
}