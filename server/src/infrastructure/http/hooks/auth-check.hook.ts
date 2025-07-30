import fp from 'fastify-plugin'
import { FastifyPluginAsync } from 'fastify'

declare module 'fastify' {
    interface FastifyContextConfig {
        allowGuest?: boolean
    }
}

const authCheckHook: FastifyPluginAsync = async (fastify) => {
    fastify.addHook('onRequest', async (request) => {
        if (request.is404) return

        const routeOptions = request.routeOptions
        const config = routeOptions.config

        if (config?.allowGuest !== true) {
            if (request.auth.isGuestContext()) {
                throw fastify.httpErrors.unauthorized()
            }
        }
    })
}

export default fp(authCheckHook, {
    name: 'auth-check-hook',
    dependencies: ['auth']
})
