import fp from 'fastify-plugin'
import { FastifyPluginAsync } from 'fastify'
import { PrismaSessionRepository } from '@/modules/session/infrastructure/repositories/prisma-session.repository.ts'
import { PrismaUserRepository } from '@/modules/user/infrastructure/repositories/prisma-user.repository.ts'
import { BearerTokenParser } from '@/modules/auth/domain/services/bearer-token.parser.ts'
import { IAuthContext } from '@/core/ports/auth-context.interface.ts'
import { SessionAuthStrategy } from '@/modules/auth/infrastructure/strategies/session-auth.strategy.ts'
import { IAuthStrategy } from '@/core/ports/auth-strategy.interface.ts'
import { FastHasher } from '@/shared/infrastructure/services/fast-hasher.service.ts'

declare module 'fastify' {
    interface FastifyRequest {
        auth: IAuthContext | null
    }
}

const authPlugin: FastifyPluginAsync = async (fastify) => {
    const sessionRepo = new PrismaSessionRepository(fastify.prisma)
    const userRepo = new PrismaUserRepository(fastify.prisma)
    const hasher = new FastHasher()

    const strategies: IAuthStrategy[] = [
        new SessionAuthStrategy({ sessionRepo, userRepo, hasher }),
    ]

    fastify.decorateRequest('auth', null)

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
    dependencies: ['prisma']
})