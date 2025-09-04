import fp from 'fastify-plugin'
import { FastifyPluginAsync } from 'fastify'
import { BearerTokenParser } from '@/modules/auth/domain/services/bearer-token.parser.ts'
import { SessionAuthStrategy } from '@/modules/auth/infrastructure/strategies/session-auth.strategy.ts'
import { IAuthStrategy } from '@/modules/auth/domain/ports/auth-strategy.interface.ts'
import { AuthContext } from '@/core/types/auth-context.type.ts'
import { GuestAuthContext } from '@/core/auth/guest-auth.context.ts'

declare module 'fastify' {
    interface FastifyRequest {
        auth: AuthContext
        _auth?: AuthContext
    }
}

const authPlugin: FastifyPluginAsync = async (fastify) => {
    const sessionRepo = fastify.sessionRepository
    const userRepo = fastify.userRepository
    const twoFactorMethodRepo = fastify.twoFactorMethodRepository
    const hasher = fastify.fastHasher

    const strategies: IAuthStrategy[] = [
        new SessionAuthStrategy({ sessionRepo, userRepo, twoFactorMethodRepo, hasher }),
    ]

    fastify.decorateRequest('auth', {
        getter() {
            if (!this._auth) {
                this._auth = new GuestAuthContext()
            }
            return this._auth
        },
        setter(value: AuthContext) {
            this._auth = value
        }
    })

    fastify.addHook('onRequest', async (request) => {
        const authHeader = request.headers.authorization

        if (!authHeader) return

        const [scheme, token] = authHeader.split(' ')

        if (scheme.toLowerCase() !== 'bearer' || !token) return

        const parser = new BearerTokenParser()
        const result = await parser.parse(token)

        if (!result) return

        const { type: tokenType, token: parsedToken } = result

        for (const strategy of strategies) {
            if (strategy.supports(tokenType)) {
                const authContext = await strategy.authenticate(parsedToken)

                if (authContext) {
                    request.auth = authContext
                    break
                }
            }
        }
    })
}

export default fp(authPlugin, {
    name: 'auth',
    dependencies: ['prisma', 'di']
})