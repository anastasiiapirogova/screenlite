import { IUserRepository } from '@/modules/user/domain/ports/user-repository.interface.ts'
import { ISessionRepository } from '@/modules/session/domain/ports/session-repository.interface.ts'
import { User } from '@/core/entities/user.entity.ts'
import { v4 as uuidv4 } from 'uuid'
import { IHasher } from '@/core/ports/hasher.interface.ts'
import { SignupDTO } from '../dto/signup.dto.ts'
import { SignupResultDTO } from '../dto/signup-result.dto.ts'
import { ValidationError } from '@/shared/errors/validation.error.ts'
import { IUnitOfWork } from '@/core/ports/unit-of-work.interface.ts'
import { UserRole } from '@/core/enums/user-role.enum.ts'
import { UserPassword } from '@/core/value-objects/user-password.value-object.ts'
import { SessionFactory } from '@/modules/session/domain/services/session.factory.ts'
import { ISessionTokenService } from '@/modules/session/domain/ports/session-token-service.interface.ts'

export type SignupUsecaseDeps = {
    userRepository: IUserRepository
    sessionRepository: ISessionRepository
    passwordHasher: IHasher
    unitOfWork: IUnitOfWork
    sessionTokenService: ISessionTokenService
}

export class SignupUsecase {
    constructor(
        private readonly deps: SignupUsecaseDeps
    ) {}

    async execute(data: SignupDTO): Promise<SignupResultDTO> {
        const { userRepository, sessionRepository, passwordHasher, unitOfWork, sessionTokenService } = this.deps

        const existing = await userRepository.findByEmail(data.email)

        if (existing) throw new ValidationError({
            email: ['EMAIL_ALREADY_EXISTS'],
        })

        const userPassword = new UserPassword(data.password)

        const passwordHash = await passwordHasher.hash(userPassword.toString())

        const user = new User({
            id: uuidv4(),
            email: data.email,
            pendingEmail: null,
            name: data.name,
            passwordHash,
            emailVerifiedAt: null,
            passwordUpdatedAt: new Date(),
            profilePhoto: null,
            deletionRequestedAt: null,
            deletedAt: null,
            role: UserRole.USER,
            version: 1,
        })

        const savedUser = await unitOfWork.execute(async (repos) => {
            await repos.userRepository.save(user)
            await repos.emailVerificationTokenRepository.deleteByEmail(data.email)

            return user
        })

        const token = sessionTokenService.generateToken()

        const hash = await sessionTokenService.hashToken(token)

        const sessionFactory = new SessionFactory()

        const session = sessionFactory.create({
            userId: savedUser.id,
            userAgent: data.userAgent,
            ipAddress: data.ipAddress,
            tokenHash: hash,
        })

        await sessionRepository.save(session)

        return {
            user: savedUser,
            token,
        }
    }
}