import fp from 'fastify-plugin'
import { FastifyPluginAsync } from 'fastify'
import { AdminPermissionDefinitionService } from '@/modules/adminPermission/domain/services/admin-permission-definition.service.ts'
import { PrismaAdminPermissionRepository } from '@/modules/adminPermission/infrastructure/repositories/prisma-admin-permission.repository.ts'
import { AdminPermissionName } from '@/core/enums/admin-permission-name.enum.ts'
import { GetUserAdminPermissionsUseCase } from '@/modules/adminPermission/application/usecases/get-user-admin-permissions.usecase.ts'
import { PrismaUserAdminPermissionRepository } from '@/modules/adminPermission/infrastructure/repositories/prisma-user-admin-permission.repository.ts'

declare module 'fastify' {
    interface FastifyRequest {
        adminPermissions: AdminPermissionName[] | null
    }
}

const adminPermissionsPlugin: FastifyPluginAsync = async (fastify) => {
    fastify.decorateRequest('adminPermissions', null)

    const adminPermissionRepo = new PrismaAdminPermissionRepository(fastify.prisma)

    const adminPermissionDefinitionService = new AdminPermissionDefinitionService(
        adminPermissionRepo
    )

    await adminPermissionDefinitionService.syncPermissions()

    fastify.addHook('onRequest', async (request) => {
        const user = request.user

        if(user?.isAdmin) {
            const getUserAdminPermissions = new GetUserAdminPermissionsUseCase(
                new PrismaUserAdminPermissionRepository(fastify.prisma),
            )

            const adminPermissions = await getUserAdminPermissions.execute(user.id)

            request.adminPermissions = adminPermissions
        }
    })
}

export default fp(adminPermissionsPlugin, {
    name: 'admin-permissions',
    dependencies: ['prisma', 'auth'],
})