import fp from 'fastify-plugin'
import { FastifyPluginAsync } from 'fastify'
import { AdminPermissionDefinitionService } from '@/modules/adminPermission/domain/services/admin-permission-definition.service.ts'
import { PrismaAdminPermissionRepository } from '@/modules/adminPermission/infrastructure/repositories/prisma-admin-permission.repository.ts'

const adminPermissionsPlugin: FastifyPluginAsync = async (fastify) => {
    const adminPermissionRepo = new PrismaAdminPermissionRepository(fastify.prisma)

    const adminPermissionDefinitionService = new AdminPermissionDefinitionService(
        adminPermissionRepo
    )

    await adminPermissionDefinitionService.syncPermissions()
}

export default fp(adminPermissionsPlugin, {
    name: 'admin-permissions',
    dependencies: ['prisma'],
})