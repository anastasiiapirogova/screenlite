import fp from 'fastify-plugin'
import { FastifyPluginAsync } from 'fastify'
import { AuthorizationError } from '@/core/errors/authorization.error.ts'
import { AuthorizationService } from '@/core/authorization/authorization.service.ts'

declare module 'fastify' {
    interface FastifyContextConfig {
        requireActiveUser?: boolean
    }
}

const accountStatusPreHandlerHook: FastifyPluginAsync = async (fastify) => {
    fastify.addHook('preHandler', async (request) => {
        const config = request.routeOptions?.config

        if (!config) {
            return
        }

        const authService = new AuthorizationService()

        authService.setAuthContext(request.auth)

        if (config.requireActiveUser) {
            if(authService.isUserContext()) {
                const isActive = authService.currentUser()?.isActive

                if (!isActive) {
                    throw new AuthorizationError({
                        user: ['YOUR_ACCOUNT_IS_NOT_ACTIVE']
                    })
                }
            }
        }
    })
}

export default fp(accountStatusPreHandlerHook, {
    name: 'account-status-pre-handler-hook',
    dependencies: ['auth']
})
