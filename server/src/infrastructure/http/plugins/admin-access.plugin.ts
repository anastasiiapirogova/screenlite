import fp from 'fastify-plugin'
import { FastifyPluginAsync, FastifyRequest } from 'fastify'
import { AdminPermissionName } from '@/core/enums/admin-permission-name.enum.ts'
import { AuthorizationService } from '@/core/authorization/authorization.service.ts'

declare module 'fastify' {
    interface FastifyInstance {
        requireAdminAccess: (request: FastifyRequest) => Promise<void>
        requireAdminPermissions: (
            permissions: AdminPermissionName | AdminPermissionName[]
        ) => (request: FastifyRequest) => Promise<void>
    }
}

const adminAccessPlugin: FastifyPluginAsync = async (fastify) => {
    const authService = new AuthorizationService()

    fastify.decorate('requireAdminAccess', async function (request: FastifyRequest) {
        authService.setAuthContext(request.auth)

        if (!authService.hasAdminAccess()) {
            throw fastify.httpErrors.forbidden('Admin access required')
        }
    })

    fastify.decorate('requireAdminPermissions', function (requiredPermissions) {
        return async (request: FastifyRequest) => {
            authService.setAuthContext(request.auth)

            if(authService.isSuperAdmin()) {
                return
            }

            const hasPermission = authService.hasAdminPermission(
                request.adminPermissions,
                requiredPermissions
            )
      
            if (!hasPermission) {
                throw fastify.httpErrors.forbidden('Insufficient permissions')
            }
        }
    })
}

export default fp(adminAccessPlugin, {
    name: 'admin-access',
    dependencies: ['auth', 'admin-permissions']
})