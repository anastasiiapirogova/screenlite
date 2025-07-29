import fp from 'fastify-plugin'
import { FastifyPluginAsync } from 'fastify'
import { PrismaAdminPermissionRepository } from '@/modules/admin-permission/infrastructure/repositories/prisma-admin-permission.repository.ts'
import { GetUserAdminPermissionsUseCase } from '@/modules/admin-permission/application/usecases/get-user-admin-permissions.usecase.ts'
import { PrismaUserAdminPermissionRepository } from '@/modules/admin-permission/infrastructure/repositories/prisma-user-admin-permission.repository.ts'
import { SyncAdminPermissionsUseCase } from '@/modules/admin-permission/application/usecases/sync-admin-permissions.usecase.ts'
import { UserSessionAuthContext } from '@/core/context/user-session-auth.context.ts'

const adminPermissionsPlugin: FastifyPluginAsync = async (fastify) => {
    fastify.decorateRequest('adminPermissions', null)

    const adminPermissionRepo = new PrismaAdminPermissionRepository(fastify.prisma)

    const syncAdminPermissionsUseCase = new SyncAdminPermissionsUseCase(adminPermissionRepo)

    await syncAdminPermissionsUseCase.execute()

    fastify.addHook('onRequest', async (request) => {
        const auth = request.auth

        if(!auth) return

        if(auth.isUserContext() && auth.hasAdminAccess()) {
            const authContext = auth as UserSessionAuthContext

            if(!authContext.user.isSuperAdmin) {
                const getUserAdminPermissions = new GetUserAdminPermissionsUseCase(
                    new PrismaUserAdminPermissionRepository(fastify.prisma),
                )

                const adminPermissions = await getUserAdminPermissions.execute(authContext.user.id)

                authContext.setAdminPermissions(adminPermissions)
            }
        }
    })
}

export default fp(adminPermissionsPlugin, {
    name: 'admin-permissions',
    dependencies: ['prisma', 'auth'],
})