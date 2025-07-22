import { IUserRepository } from '@/core/ports/user-repository.interface.ts'
import { ISessionRepository } from '@/core/ports/session-repository.interface.ts'
import { ISessionTokenGenerator } from '@/core/ports/session-token-generator.interface.ts'
import { User } from '@/core/entities/user.entity.ts'
import { Session } from '@/core/entities/session.entity.ts'
import { v4 as uuidv4 } from 'uuid'
import { IPasswordHasher } from '@/core/ports/password-hasher.interface.ts'
import { SignupDTO } from '../dto/signup.dto.ts'
import { SignupResultDTO } from '../dto/signup-result.dto.ts'
import { ValidationError } from '@/core/errors/validation.error.ts'

export class SignupUsecase {
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly sessionRepository: ISessionRepository,
        private readonly tokenGenerator: ISessionTokenGenerator,
        private readonly passwordHasher: IPasswordHasher
    ) {}

    async execute(data: SignupDTO): Promise<SignupResultDTO> {
        const existing = await this.userRepository.findByEmail(data.email)

        if (existing) throw new ValidationError({
            email: ['EMAIL_ALREADY_EXISTS'],
        })

        const hashedPassword = await this.passwordHasher.hash(data.password)

        const user = new User({
            id: uuidv4(),
            email: data.email,
            name: data.name,
            password: hashedPassword,
            emailVerifiedAt: null,
            passwordUpdatedAt: new Date(),
            profilePhoto: null,
            totpSecret: null,
            twoFactorEnabled: false,
            deletedAt: null,
        })

        await this.userRepository.save(user)

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

        return {
            user,
            token,
        }
    }
} 