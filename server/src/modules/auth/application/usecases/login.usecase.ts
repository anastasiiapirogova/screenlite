import { IUserRepository } from '@/modules/user/domain/ports/user-repository.interface.ts'
import { ISessionRepository } from '@/modules/session/domain/ports/session-repository.interface.ts'
import { IHasher } from '@/core/ports/hasher.interface.ts'
import { LoginDTO } from '../dto/login.dto.ts'
import { ValidationError } from '@/shared/errors/validation.error.ts'
import { LoginResultDTO } from '../dto/login-result.dto.ts'
import { ISessionTokenService } from '@/modules/session/domain/ports/session-token-service.interface.ts'
import { SessionFactory } from '@/modules/session/domain/services/session.factory.ts'

export type LoginUsecaseDeps = {
    userRepository: IUserRepository
    sessionRepository: ISessionRepository
    passwordHasher: IHasher
    sessionTokenService: ISessionTokenService
}

export class LoginUsecase {
    constructor(
        private readonly deps: LoginUsecaseDeps
    ) {}

    async execute(data: LoginDTO): Promise<LoginResultDTO> {
        const { userRepository, sessionRepository, passwordHasher, sessionTokenService } = this.deps

        const user = await userRepository.findByEmail(data.email)

        if (!user) {
            throw new ValidationError({ email: ['USER_WITH_EMAIL_NOT_FOUND'] })
        }

        const valid = await passwordHasher.compare(data.password, user.passwordHash)

        if (!valid) {
            throw new ValidationError({ password: ['INVALID_PASSWORD'] })
        }

        const token = sessionTokenService.generateToken()

        const tokenHash = await sessionTokenService.hashToken(token)

        const sessionFactory = new SessionFactory()

        const session = sessionFactory.create({
            userId: user.id,
            userAgent: data.userAgent,
            ipAddress: data.ipAddress,
            tokenHash,
        })

        await sessionRepository.save(session)

        return { user, token }
    }
} 