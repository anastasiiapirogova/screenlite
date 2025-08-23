import { IUserRepository } from '@/modules/user/domain/ports/user-repository.interface.ts'
import { ISessionRepository } from '@/modules/session/domain/ports/session-repository.interface.ts'
import { IHasher } from '@/core/ports/hasher.interface.ts'
import { LoginDTO } from '../dto/login.dto.ts'
import { ValidationError } from '@/shared/errors/validation.error.ts'
import { LoginResultDTO } from '../dto/login-result.dto.ts'
import { ISessionTokenService } from '@/modules/session/domain/ports/session-token-service.interface.ts'
import { SessionFactory } from '@/modules/session/domain/services/session.factory.ts'
import { IUserCredentialRepository } from '@/core/ports/user-credential-repository.interface.ts'
import { UserCredentialType } from '@/core/enums/user-credential-type.enum.ts'
import { UserPassword } from '@/core/entities/user-password.entity.ts'

export type LoginUsecaseDeps = {
    userRepository: IUserRepository
    sessionRepository: ISessionRepository
    passwordHasher: IHasher
    sessionTokenService: ISessionTokenService
    userCredentialRepository: IUserCredentialRepository
}

export class LoginUsecase {
    constructor(
        private readonly deps: LoginUsecaseDeps
    ) {}

    async execute(data: LoginDTO): Promise<LoginResultDTO> {
        const { userRepository, sessionRepository, passwordHasher, sessionTokenService, userCredentialRepository } = this.deps

        const user = await userRepository.findByEmail(data.email)

        if (!user) {
            throw new ValidationError({ email: ['USER_WITH_EMAIL_NOT_FOUND'] })
        }

        const userCredentials = await userCredentialRepository.findByUserId(user.id)

        const passwordCredential = userCredentials.find(credential => credential.type === UserCredentialType.PASSWORD) as UserPassword

        if (!passwordCredential) {
            throw new ValidationError({ password: ['PASSWORD_CREDENTIAL_NOT_FOUND'] })
        }

        const valid = await passwordCredential.validate(data.password, passwordHasher)

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

        return {
            user,
            token: sessionTokenService.formatToken(token)
        }
    }
}