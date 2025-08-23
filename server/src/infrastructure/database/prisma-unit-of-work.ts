import { PrismaClient } from '@/generated/prisma/client.ts'
import { PrismaUserRepository } from '@/modules/user/infrastructure/repositories/prisma-user.repository.ts'
import { IUserRepository } from '@/modules/user/domain/ports/user-repository.interface.ts'
import { IUnitOfWork } from '@/core/ports/unit-of-work.interface.ts'
import { ISessionRepository } from '@/modules/session/domain/ports/session-repository.interface.ts'
import { PrismaSessionRepository } from '@/modules/session/infrastructure/repositories/prisma-session.repository.ts'
import { PrismaEmailVerificationTokenRepository } from '@/modules/email-verification/infrastructure/repositories/prisma-email-verification-token.repository.ts'
import { IEmailVerificationTokenRepository } from '@/modules/email-verification/domain/ports/email-verification-token-repository.interface.ts'
import { IUserAdminPermissionRepository } from '@/modules/admin-permission/domain/ports/user-admin-permission-repository.interface.ts'
import { IAdminPermissionRepository } from '@/modules/admin-permission/domain/ports/admin-permission-repository.interface.ts'
import { PrismaUserAdminPermissionRepository } from '@/modules/admin-permission/infrastructure/repositories/prisma-user-admin-permission.repository.ts'
import { PrismaAdminPermissionRepository } from '@/modules/admin-permission/infrastructure/repositories/prisma-admin-permission.repository.ts'
import { IPasswordResetTokenRepository } from '@/modules/password-reset/domain/ports/password-reset-token-repository.interface.ts'
import { PrismaPasswordResetTokenRepository } from '@/modules/password-reset/infrastructure/repositories/prisma-password-reset-token.repository.ts'
import { ITwoFactorMethodRepository } from '@/modules/two-factor-auth/domain/ports/two-factor-method-repository.interface.ts'
import { PrismaTwoFactorMethodRepository } from '@/modules/two-factor-auth/infrastructure/repositories/prisma-two-factor-method.repository.ts'
import { TwoFactorConfigHandlerFactory } from '@/modules/two-factor-auth/infrastructure/handlers/two-factor-config-handler.factory.ts'
import { IUserCredentialRepository } from '@/core/ports/user-credential-repository.interface.ts'
import { PrismaUserCredentialRepository } from '@/modules/user/infrastructure/repositories/prisma-user-credential.repository.ts'

export class PrismaUnitOfWork implements IUnitOfWork {
    constructor(private prisma: PrismaClient) {}
  
    async execute<T>(
        fn: (repos: {
            userRepository: IUserRepository
            sessionRepository: ISessionRepository
            emailVerificationTokenRepository: IEmailVerificationTokenRepository
            userAdminPermissionRepository: IUserAdminPermissionRepository
            adminPermissionRepository: IAdminPermissionRepository
            passwordResetTokenRepository: IPasswordResetTokenRepository
            twoFactorMethodRepository: ITwoFactorMethodRepository
            userCredentialRepository: IUserCredentialRepository
        }) => Promise<T>
    ): Promise<T> {
        return this.prisma.$transaction(async (tx) => {
            const repos = {
                userRepository: new PrismaUserRepository(tx),
                sessionRepository: new PrismaSessionRepository(tx),
                emailVerificationTokenRepository: new PrismaEmailVerificationTokenRepository(tx),
                userAdminPermissionRepository: new PrismaUserAdminPermissionRepository(tx),
                adminPermissionRepository: new PrismaAdminPermissionRepository(tx),
                passwordResetTokenRepository: new PrismaPasswordResetTokenRepository(tx),
                twoFactorMethodRepository: new PrismaTwoFactorMethodRepository(tx, new TwoFactorConfigHandlerFactory(tx)),
                userCredentialRepository: new PrismaUserCredentialRepository(tx),
            }
        
            return fn(repos)
        })
    }
}