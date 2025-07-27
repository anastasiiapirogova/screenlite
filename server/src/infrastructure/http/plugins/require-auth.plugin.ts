import { FastifyPluginAsync, FastifyRequest } from 'fastify'
import fp from 'fastify-plugin'

declare module 'fastify' {
    interface FastifyInstance {
        requireAuth: (request: FastifyRequest) => Promise<void>
    }
}

const requireAuthPlugin: FastifyPluginAsync = async (fastify) => {
    fastify.decorate('requireAuth', async function (request: FastifyRequest) {
        if (!request.auth) {
            throw fastify.httpErrors.unauthorized()
        }
    })
}

export default fp(requireAuthPlugin, {
    name: 'require-auth',
    dependencies: ['auth'],
})