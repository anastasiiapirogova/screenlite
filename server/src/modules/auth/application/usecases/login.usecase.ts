import { IUserRepository } from '@/core/ports/user-repository.interface.ts'
import { ISessionRepository } from '@/core/ports/session-repository.interface.ts'
import { IPasswordHasher } from '@/core/ports/password-hasher.interface.ts'
import { LoginDTO } from '../dto/login.dto.ts'
import { ValidationError } from '@/core/errors/validation.error.ts'
import { LoginResultDTO } from '../dto/login-result.dto.ts'
import { ISessionFactory } from '@/core/ports/session-factory.interface.ts'

export class LoginUsecase {
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly sessionRepository: ISessionRepository,
        private readonly passwordHasher: IPasswordHasher,
        private readonly sessionFactory: ISessionFactory,
    ) {}

    async execute(data: LoginDTO): Promise<LoginResultDTO> {
        const user = await this.userRepository.findByEmail(data.email)

        if (!user) {
            throw new ValidationError({ email: ['USER_WITH_EMAIL_NOT_FOUND'] })
        }

        const valid = await this.passwordHasher.compare(data.password, user.toDTO().password)

        if (!valid) {
            throw new ValidationError({ password: ['INVALID_PASSWORD'] })
        }

        const session = this.sessionFactory.create({
            userId: user.id,
            userAgent: data.userAgent,
            ipAddress: data.ipAddress,
        })

        await this.sessionRepository.save(session)

        return { user, token: session.token }
    }
} 