import fp from 'fastify-plugin'
import { FastifyPluginAsync } from 'fastify'

declare module 'fastify' {
    interface FastifyContextConfig {
        allowGuest?: boolean
    }
}

const authCheckHook: FastifyPluginAsync = async (fastify) => {
    fastify.addHook('onRequest', async (request) => {
        const config = request.routeOptions?.config

        if (!config) {
            return
        }

        if (!config.allowGuest) {
            if(request.auth.isGuestContext()) {
                throw fastify.httpErrors.unauthorized()
            }
        }
    })
}

export default fp(authCheckHook, {
    name: 'auth-check-hook',
    dependencies: ['auth']
})
