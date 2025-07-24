import fp from 'fastify-plugin'
import { FastifyPluginAsync } from 'fastify'
import { PrismaSessionRepository } from '@/modules/session/infrastructure/repositories/prisma-session.repository.ts'
import { PrismaUserRepository } from '@/modules/user/infrastructure/repositories/prisma-user.repository.ts'
import { BearerSessionTokenParser } from '@/modules/session/domain/services/bearer-session-token.parser.ts'
import { ValidateSessionUseCase } from '@/modules/session/application/usecases/validate-session.usecase.ts'
import { Session } from '@/core/entities/session.entity.ts'
import { FastHasher } from '@/shared/infrastructure/services/fast-hasher.service.ts'
import { User } from '@/core/entities/user.entity.ts'
import { PrismaUserAdminPermissionRepository } from '@/modules/adminPermission/infrastructure/repositories/prisma-user-admin-permission.repository.ts'
import { AdminPermissionName } from '@/core/enums/admin-permission-name.enum.ts'
import { GetUserAdminPermissionsUseCase } from '@/modules/adminPermission/application/usecases/get-user-admin-permissions.usecase.ts'

declare module 'fastify' {
    interface FastifyRequest {
        user: User | null
        session: Session | null
        adminPermissions: AdminPermissionName[] | null
    }
}

const authPlugin: FastifyPluginAsync = async (fastify) => {
    fastify.decorateRequest('user', null)
    fastify.decorateRequest('adminPermissions', null)

    fastify.addHook('onRequest', async (request) => {
        const authHeader = request.headers.authorization

        if (!authHeader) {
            return
        }

        const [scheme, token] = authHeader.split(' ')

        if (scheme.toLowerCase() !== 'bearer' || !token) {
            return
        }

        const parser = new BearerSessionTokenParser()
        const sessionToken = await parser.parse(token)

        const sessionRepo = new PrismaSessionRepository(fastify.prisma)
        const userRepo = new PrismaUserRepository(fastify.prisma)
        const hasher = new FastHasher()
        
        const validateSession = new ValidateSessionUseCase({
            sessionRepo: sessionRepo,
            userRepo: userRepo,
            hasher,
        })

        try {
            const { user, session } = await validateSession.execute(sessionToken)

            if(user.isAdmin) {
                const getUserAdminPermissions = new GetUserAdminPermissionsUseCase(
                    new PrismaUserAdminPermissionRepository(fastify.prisma),
                )

                const adminPermissions = await getUserAdminPermissions.execute(user.id)

                request.adminPermissions = adminPermissions
            }

            request.user = user
            request.session = session
        } catch {
            return
        }
    })
}

export default fp(authPlugin, {
    name: 'auth',
    dependencies: ['prisma'],
})
