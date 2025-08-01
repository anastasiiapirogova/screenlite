import { IUserRepository } from '@/core/ports/user-repository.interface.ts'
import { ISessionRepository } from '@/core/ports/session-repository.interface.ts'
import { IHasher } from '@/core/ports/hasher.interface.ts'
import { LoginDTO } from '../dto/login.dto.ts'
import { ValidationError } from '@/core/errors/validation.error.ts'
import { LoginResultDTO } from '../dto/login-result.dto.ts'
import { ISessionFactory } from '@/core/ports/session-factory.interface.ts'

export type LoginUsecaseDeps = {
    userRepository: IUserRepository
    sessionRepository: ISessionRepository
    passwordHasher: IHasher
    sessionFactory: ISessionFactory
}

export class LoginUsecase {
    constructor(
        private readonly deps: LoginUsecaseDeps
    ) {}

    async execute(data: LoginDTO): Promise<LoginResultDTO> {
        const { userRepository, sessionRepository, passwordHasher, sessionFactory } = this.deps

        const user = await userRepository.findByEmail(data.email)

        if (!user) {
            throw new ValidationError({ email: ['USER_WITH_EMAIL_NOT_FOUND'] })
        }

        const valid = await passwordHasher.compare(data.password, user.passwordHash)

        if (!valid) {
            throw new ValidationError({ password: ['INVALID_PASSWORD'] })
        }

        const { session, token } = await sessionFactory.create({
            userId: user.id,
            userAgent: data.userAgent,
            ipAddress: data.ipAddress,
        })

        await sessionRepository.save(session)

        return { user, token }
    }
} 