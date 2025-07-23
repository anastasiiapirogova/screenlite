import { IUserRepository } from '@/core/ports/user-repository.interface.ts'
import { ISessionRepository } from '@/core/ports/session-repository.interface.ts'
import { ISessionTokenGenerator } from '@/core/ports/session-token-generator.interface.ts'
import { IPasswordHasher } from '@/core/ports/password-hasher.interface.ts'
import { Session } from '@/core/entities/session.entity.ts'
import { v4 as uuidv4 } from 'uuid'
import { LoginDTO } from '../dto/login.dto.ts'
import { ValidationError } from '@/core/errors/validation.error.ts'
import { LoginResultDTO } from '../dto/login-result.dto.ts'

export class LoginUsecase {
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly sessionRepository: ISessionRepository,
        private readonly tokenGenerator: ISessionTokenGenerator,
        private readonly passwordHasher: IPasswordHasher,
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

        const token = this.tokenGenerator.generate()

        const session = new Session({
            id: uuidv4(),
            userId: user.id,
            token,
            userAgent: data.userAgent,
            ipAddress: data.ipAddress,
            location: null,
            terminatedAt: null,
            lastActivityAt: new Date(),
            twoFaVerifiedAt: null,
        })

        await this.sessionRepository.save(session)

        return { user, token }
    }
} 