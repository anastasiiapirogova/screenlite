import fp from 'fastify-plugin'
import { FastifyPluginAsync, FastifyRequest } from 'fastify'

declare module 'fastify' {
    interface FastifyInstance {
        requireAdminAccess: (request: FastifyRequest) => Promise<void>
    }
}

const adminAccessPlugin: FastifyPluginAsync = async (fastify) => {
    fastify.decorate('requireAdminAccess', async function (request: FastifyRequest) {
        if (!request.auth?.hasAdminAccess()) {
            throw fastify.httpErrors.forbidden('ADMIN_ACCESS_REQUIRED')
        }
    })
}

export default fp(adminAccessPlugin, {
    name: 'admin-access',
    dependencies: ['auth']
})