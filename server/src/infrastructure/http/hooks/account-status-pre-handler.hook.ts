import fp from 'fastify-plugin'
import { FastifyPluginAsync } from 'fastify'
import { UserSessionAuthContext } from '@/core/context/user-session-auth.context.ts'

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

        if (config.requireActiveUser) {
            if(request.auth?.isUserContext()) {
                const authContext = request.auth as UserSessionAuthContext

                const isActive = authContext.user.isActive

                if (!isActive) {
                    throw fastify.httpErrors.forbidden('YOUR_ACCOUNT_IS_NOT_ACTIVE')
                }
            }
        }
    })
}

export default fp(accountStatusPreHandlerHook, {
    name: 'account-status-pre-handler-hook',
    dependencies: ['auth']
})
