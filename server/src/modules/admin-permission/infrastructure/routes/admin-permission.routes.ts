import { FastifyInstance } from 'fastify'
import { setAdminPermissionsRoute } from './set-admin-permissions.route.ts'
import { getUserPermissionsRoute } from './get-user-permissions.route.ts'
import { resolveAuthContextAdminPermissionsRoute } from './resolve-auth-context-admin-permissions.route.ts'

// Prefix: /api/admin/permissions
const adminPermissionRoutes = async (fastify: FastifyInstance) => {
    await Promise.all([
        setAdminPermissionsRoute(fastify),
        getUserPermissionsRoute(fastify),
        resolveAuthContextAdminPermissionsRoute(fastify),
    ])
}

export default adminPermissionRoutes