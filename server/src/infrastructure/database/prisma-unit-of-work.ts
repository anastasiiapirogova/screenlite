import { PrismaClient } from '@/generated/prisma/client.ts'
import { PrismaUserRepository } from '@/modules/user/infrastructure/repositories/prisma-user.repository.ts'
import { IUnitOfWork, IUnitOfWorkRepositories } from '@/core/ports/unit-of-work.interface.ts'
import { PrismaSessionRepository } from '@/modules/session/infrastructure/repositories/prisma-session.repository.ts'
import { PrismaEmailVerificationTokenRepository } from '@/modules/email-verification/infrastructure/repositories/prisma-email-verification-token.repository.ts'
import { PrismaUserAdminPermissionRepository } from '@/modules/admin-permission/infrastructure/repositories/prisma-user-admin-permission.repository.ts'
import { PrismaAdminPermissionRepository } from '@/modules/admin-permission/infrastructure/repositories/prisma-admin-permission.repository.ts'
import { PrismaPasswordResetTokenRepository } from '@/modules/password-reset/infrastructure/repositories/prisma-password-reset-token.repository.ts'
import { PrismaTwoFactorMethodRepository } from '@/modules/two-factor-auth/infrastructure/repositories/prisma-two-factor-method.repository.ts'
import { TwoFactorConfigHandlerFactory } from '@/modules/two-factor-auth/infrastructure/handlers/two-factor-config-handler.factory.ts'
import { PrismaUserCredentialRepository } from '@/modules/user/infrastructure/repositories/prisma-user-credential.repository.ts'
import { PrismaWorkspaceRepository } from '@/modules/workspace/infrastructure/repositories/prisma-workspace.repository.ts'
import { PrismaWorkspaceMemberRepository } from '@/modules/workspace-member/infrastructure/repositories/prisma-workspace-member.repository.ts'
import { PrismaWorkspaceInvitationRepository } from '@/modules/workspace-invitation/infrastructure/repositories/prisma-workspace-invitation.repository.ts'

export class PrismaUnitOfWork implements IUnitOfWork {
    constructor(private prisma: PrismaClient) {}
  
    async execute<T>(
        fn: (repos: IUnitOfWorkRepositories) => Promise<T>
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
                workspaceRepository: new PrismaWorkspaceRepository(tx),
                workspaceMemberRepository: new PrismaWorkspaceMemberRepository(tx),
                workspaceInvitationRepository: new PrismaWorkspaceInvitationRepository(tx),
            }
        
            return fn(repos)
        })
    }
}