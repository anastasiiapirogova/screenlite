import { FastifyPluginAsync, FastifyRequest } from 'fastify'
import fp from 'fastify-plugin'
import { UnauthorizedError } from '@/core/errors/http.errors.ts'

declare module 'fastify' {
    interface FastifyInstance {
        requireAuth: (request: FastifyRequest) => Promise<void>
    }
}

const requireAuthPlugin: FastifyPluginAsync = async (fastify) => {
    fastify.decorate('requireAuth', async function (request: FastifyRequest) {
        if (!request.user) {
            throw new UnauthorizedError('Authentication required')
        }
    })
}

export default fp(requireAuthPlugin, {
    name: 'require-auth',
    dependencies: ['auth'],
})