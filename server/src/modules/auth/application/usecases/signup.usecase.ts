import { IUserRepository } from '@/core/ports/user-repository.interface.ts'
import { ISessionRepository } from '@/core/ports/session-repository.interface.ts'
import { User } from '@/core/entities/user.entity.ts'
import { v4 as uuidv4 } from 'uuid'
import { IHasher } from '@/core/ports/hasher.interface.ts'
import { SignupDTO } from '../dto/signup.dto.ts'
import { SignupResultDTO } from '../dto/signup-result.dto.ts'
import { ValidationError } from '@/core/errors/validation.error.ts'
import { ISessionFactory } from '@/core/ports/session-factory.interface.ts'
import { IUnitOfWork } from '@/core/ports/unit-of-work.interface.ts'
import { UserRole } from '@/core/enums/user-role.enum.ts'

export type SignupUsecaseDeps = {
    userRepository: IUserRepository
    sessionRepository: ISessionRepository
    sessionFactory: ISessionFactory
    passwordHasher: IHasher
    unitOfWork: IUnitOfWork
}

export class SignupUsecase {
    constructor(
        private readonly deps: SignupUsecaseDeps
    ) {}

    async execute(data: SignupDTO): Promise<SignupResultDTO> {
        const { userRepository, sessionRepository, sessionFactory, passwordHasher, unitOfWork } = this.deps

        const existing = await userRepository.findByEmail(data.email)

        if (existing) throw new ValidationError({
            email: ['EMAIL_ALREADY_EXISTS'],
        })

        const hashedPassword = await passwordHasher.hash(data.password)

        const user = new User({
            id: uuidv4(),
            email: data.email,
            pendingEmail: null,
            name: data.name,
            password: hashedPassword,
            emailVerifiedAt: null,
            passwordUpdatedAt: new Date(),
            profilePhoto: null,
            totpSecret: null,
            twoFactorEnabled: false,
            deletionRequestedAt: null,
            deletedAt: null,
            role: UserRole.USER,
        })

        const savedUser = await unitOfWork.execute(async (repos) => {
            await repos.userRepository.save(user)
            await repos.emailVerificationTokenRepository.deleteForEmail(data.email)

            return user
        })

        const { session, token } = await sessionFactory.create({
            userId: savedUser.id,
            userAgent: data.userAgent,
            ipAddress: data.ipAddress,
        })

        await sessionRepository.save(session)

        return {
            user: savedUser,
            token,
        }
    }
} 