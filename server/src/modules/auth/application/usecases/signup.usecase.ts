import { IUserRepository } from '@/core/ports/user-repository.interface.ts'
import { ISessionRepository } from '@/core/ports/session-repository.interface.ts'
import { User } from '@/core/entities/user.entity.ts'
import { v4 as uuidv4 } from 'uuid'
import { IPasswordHasher } from '@/core/ports/password-hasher.interface.ts'
import { SignupDTO } from '../dto/signup.dto.ts'
import { SignupResultDTO } from '../dto/signup-result.dto.ts'
import { ValidationError } from '@/core/errors/validation.error.ts'
import { ISessionFactory } from '@/core/ports/session-factory.interface.ts'

export class SignupUsecase {
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly sessionRepository: ISessionRepository,
        private readonly sessionFactory: ISessionFactory,
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
            deletionRequestedAt: null,
            deletedAt: null,
        })

        await this.userRepository.save(user)

        const session = this.sessionFactory.create({
            userId: user.id,
            userAgent: data.userAgent,
            ipAddress: data.ipAddress,
        })

        await this.sessionRepository.save(session)

        return {
            user,
            token: session.token,
        }
    }
} 