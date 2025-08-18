import fp from 'fastify-plugin'
import { FastifyPluginAsync } from 'fastify'

declare module 'fastify' {
    interface FastifyContextConfig {
        allowGuest?: boolean
        allowSkipTwoFactorAuth?: boolean
        allowDeletedUser?: boolean
    }
}

const authCheckHook: FastifyPluginAsync = async (fastify) => {
    fastify.addHook('onRequest', async (request) => {
        if (request.is404) return

        const routeOptions = request.routeOptions
        const config = routeOptions.config

        if (config.allowGuest !== true) {
            if (request.auth.isGuestContext()) {
                throw fastify.httpErrors.unauthorized()
            }
        }

        if (config.allowSkipTwoFactorAuth !== true) {
            if(request.auth.isUserContext() && request.auth.pendingTwoFactorAuth) {
                throw fastify.httpErrors.unauthorized('TWO_FACTOR_AUTH_REQUIRED')
            }
        }

        if (config.allowDeletedUser !== true) {
            if(request.auth?.isUserContext()) {
                const authContext = request.auth

                const isActive = authContext.user.isActive

                if (!isActive) {
                    throw fastify.httpErrors.forbidden('YOUR_ACCOUNT_IS_DELETED')
                }
            }
        }
    })
}

export default fp(authCheckHook, {
    name: 'auth-check-hook',
    dependencies: ['auth']
})
