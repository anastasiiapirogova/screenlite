import { NotFoundError } from '@/shared/errors/not-found.error.ts'
import { IUserRepository } from '@/modules/user/domain/ports/user-repository.interface.ts'
import { IEmailVerificationTokenRepository } from '@/modules/email-verification/domain/ports/email-verification-token-repository.interface.ts'
import { IJobProducer } from '@/core/ports/job-queue.interface.ts'
import { AppJobRegistry } from '@/core/ports/job-registry.interface.ts'
import { IEmailVerificationTokenFactory } from '@/modules/email-verification/domain/ports/email-verification-token-factory.interface.ts'
import { IUnitOfWork } from '@/core/ports/unit-of-work.interface.ts'
import { IConfig } from '@/infrastructure/config/config.interface.ts'
import { ValidationError } from '@/shared/errors/validation.error.ts'
import { EmailVerificationTokenType } from '@/core/enums/email-verification-token-type.enum.ts'

export type RequestEmailChangeUseCaseDeps = {
    userRepo: IUserRepository
    tokenRepo: IEmailVerificationTokenRepository
    tokenFactory: IEmailVerificationTokenFactory
    jobProducer: IJobProducer<AppJobRegistry>
    unitOfWork: IUnitOfWork
    config: IConfig
}

export class RequestEmailChangeUseCase {
    constructor(
        private readonly deps: RequestEmailChangeUseCaseDeps
    ) {}
  
    async execute(userId: string, newEmail: string) {
        const { userRepo, tokenRepo, tokenFactory, unitOfWork, config, jobProducer } = this.deps

        const existingUser = await userRepo.findByEmail(newEmail)

        if (existingUser) {
            throw new ValidationError({
                email: ['EMAIL_ALREADY_IN_USE'],
            })
        }

        const user = await userRepo.findById(userId)

        if (!user) {
            throw new NotFoundError()
        }
  
        await tokenRepo.deleteAllByUserId(userId, EmailVerificationTokenType.EMAIL_CHANGE)
        
        const timeToLive = config.ttls.emailChange
  
        const expires = new Date(Date.now() + timeToLive)
  
        const { token, rawToken } = await tokenFactory.create({
            userId,
            type: EmailVerificationTokenType.EMAIL_CHANGE,
            expiresAt: expires,
            newEmail,
        })

        user.email.setPending(newEmail)  

        await unitOfWork.execute(async (repos) => {
            await repos.userRepository.save(user)
            await repos.emailVerificationTokenRepository.create(token)
        })

        await jobProducer.enqueue('send_email_change_confirmation', {
            email: newEmail,
            token: rawToken,
            newEmail,
        })
    }
}   