import { IPasswordResetTokenRepository } from '@/core/ports/password-reset-token-repository.interface.ts'
import { IUnitOfWork } from '@/core/ports/unit-of-work.interface.ts'
import { IUserRepository } from '@/core/ports/user-repository.interface.ts'
import { RequestPasswordResetDTO } from '../dto/request-password-reset.dto.ts'
import { ValidationError } from '@/core/errors/validation.error.ts'
import { IConfig } from '@/infrastructure/config/config.interface.ts'
import { IJobProducer } from '@/core/ports/job-queue.interface.ts'
import { AppJobRegistry } from '@/core/ports/job-registry.interface.ts'
import { IPasswordResetTokenFactory } from '@/core/ports/password-reset-token-factory.interface.ts'

export type RequestPasswordResetUsecaseDeps = {
    unitOfWork: IUnitOfWork
    userRepo: IUserRepository
    passwordResetTokenRepo: IPasswordResetTokenRepository
    config: IConfig
    jobProducer: IJobProducer<AppJobRegistry>
    passwordResetTokenFactory: IPasswordResetTokenFactory
}

export class RequestPasswordResetUsecase {
    constructor(private readonly deps: RequestPasswordResetUsecaseDeps) {}

    async execute(data: RequestPasswordResetDTO): Promise<void> {
        const { unitOfWork, userRepo, jobProducer, passwordResetTokenFactory, config } = this.deps

        const user = await userRepo.findByEmail(data.email)

        if (!user) {
            throw new ValidationError({
                email: ['USER_NOT_FOUND'],
            })
        }

        const { passwordResetToken, rawToken } = await passwordResetTokenFactory.create({
            userId: user.id,
            expiresAt: new Date(Date.now() + config.ttls.passwordReset),
        })

        await unitOfWork.execute(async (repos) => {
            await repos.passwordResetTokenRepository.deleteAllByUserId(user.id)
            await repos.passwordResetTokenRepository.save(passwordResetToken)
        })

        await jobProducer.enqueue('send_password_reset_email', {
            email: data.email,
            token: rawToken,
        })
    }
}