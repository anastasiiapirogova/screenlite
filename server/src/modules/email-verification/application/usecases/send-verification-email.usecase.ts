import { IEmailVerificationTokenFactory } from '@/core/ports/email-verification-token-factory.interface.ts'
import { IEmailVerificationTokenRepository } from '@/core/ports/email-verification-token-repository.interface.ts'
import { IUserRepository } from '@/core/ports/user-repository.interface.ts'
import { NotFoundError } from '@/core/errors/not-found.error.ts'
import { IJobProducer } from '@/core/ports/job-queue.interface.ts'
import { AppJobRegistry } from '@/core/ports/job-registry.interface.ts'
import { ValidationError } from '@/core/errors/validation.error.ts'
import { IConfig } from '@/infrastructure/config/config.interface.ts'
import { EmailVerificationTokenType } from '@/core/enums/email-verification-token-type.enum.ts'

export type SendVerificationEmailUseCaseDeps = {
    userRepo: IUserRepository
    tokenRepo: IEmailVerificationTokenRepository
    tokenFactory: IEmailVerificationTokenFactory
    jobProducer: IJobProducer<AppJobRegistry>
    config: IConfig
}

export class SendVerificationEmailUseCase {
    constructor(
        private readonly deps: SendVerificationEmailUseCaseDeps
    ) {}

    async execute(userId: string) {
        const { userRepo, tokenRepo, tokenFactory, jobProducer, config } = this.deps

        const user = await userRepo.findById(userId)

        if (!user) {
            throw new NotFoundError()
        }

        const latestToken = await tokenRepo.findLatestForUser(userId, EmailVerificationTokenType.VERIFY)

        const cooldown = 5 * 60 * 1000 // 5 minutes

        if (latestToken && latestToken.createdAt > new Date(Date.now() - cooldown)) {
            throw new ValidationError({
                userId: ['VERIFICATION_EMAIL_RECENTLY_SENT'],
            })
        }
  
        await tokenRepo.deleteAllForUser(userId, EmailVerificationTokenType.VERIFY)

        const timeToLive = config.ttls.emailVerification

        const expires = new Date(Date.now() + timeToLive)
  
        const { token, rawToken } = await tokenFactory.create({
            userId,
            type: EmailVerificationTokenType.VERIFY,
            expiresAt: expires,
        })

        await tokenRepo.create(token)

        await jobProducer.enqueue('send_verification_email', {
            email: user.email,
            token: rawToken,
        })
    }
}