import { PrismaClient } from '@/generated/prisma/client.ts'
import { PrismaUserRepository } from '@/modules/user/infrastructure/repositories/prisma-user.repository.ts'
import { IUserRepository } from '@/core/ports/user-repository.interface.ts'
import { IUnitOfWork } from '@/core/ports/unit-of-work.interface.ts'
import { ISessionRepository } from '@/core/ports/session-repository.interface.ts'
import { PrismaSessionRepository } from '@/modules/session/infrastructure/repositories/prisma-session.repository.ts'
import { PrismaEmailVerificationTokenRepository } from '@/modules/email-verification/infrastructure/repositories/prisma-email-verification-token.repository.ts'
import { IEmailVerificationTokenRepository } from '@/core/ports/email-verification-token-repository.interface.ts'
import { IUserAdminPermissionRepository } from '@/core/ports/user-admin-permission-repository.interface.ts'
import { IAdminPermissionRepository } from '@/core/ports/admin-permission-repository.interface.ts'
import { PrismaUserAdminPermissionRepository } from '@/modules/admin-permission/infrastructure/repositories/prisma-user-admin-permission.repository.ts'
import { PrismaAdminPermissionRepository } from '@/modules/admin-permission/infrastructure/repositories/prisma-admin-permission.repository.ts'

export class PrismaUnitOfWork implements IUnitOfWork {
    constructor(private prisma: PrismaClient) {}
  
    async execute<T>(
        fn: (repos: {
            userRepository: IUserRepository
            sessionRepository: ISessionRepository
            emailVerificationTokenRepository: IEmailVerificationTokenRepository
            userAdminPermissionRepository: IUserAdminPermissionRepository
            adminPermissionRepository: IAdminPermissionRepository
        }) => Promise<T>
    ): Promise<T> {
        return this.prisma.$transaction(async (tx) => {
            const repos = {
                userRepository: new PrismaUserRepository(tx),
                sessionRepository: new PrismaSessionRepository(tx),
                emailVerificationTokenRepository: new PrismaEmailVerificationTokenRepository(tx),
                userAdminPermissionRepository: new PrismaUserAdminPermissionRepository(tx),
                adminPermissionRepository: new PrismaAdminPermissionRepository(tx),
            }
        
            return fn(repos)
        })
    }
}