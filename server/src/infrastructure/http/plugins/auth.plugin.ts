import fp from 'fastify-plugin'
import { FastifyPluginAsync } from 'fastify'
import { PrismaSessionRepository } from '@/modules/session/infrastructure/repositories/prisma-session.repository.ts'
import { PrismaUserRepository } from '@/modules/user/infrastructure/repositories/prisma-user.repository.ts'
import { BearerSessionTokenParser } from '@/modules/session/domain/services/bearer-session-token.parser.ts'
import { ValidateSessionUseCase } from '@/modules/session/application/usecases/validate-session.usecase.ts'
import { PublicUserDTO } from '@/core/dto/public-user.dto.ts'

declare module 'fastify' {
    interface FastifyRequest {
        user: PublicUserDTO | null
    }
}

const authPlugin: FastifyPluginAsync = async (fastify) => {
    fastify.decorateRequest('user', null)

    fastify.addHook('onRequest', async (request) => {
        const authHeader = request.headers.authorization

        if (!authHeader) {
            return
        }

        const [scheme, token] = authHeader.split(' ')

        if (scheme.toLowerCase() !== 'bearer' || !token) {
            return
        }

        const parser = new BearerSessionTokenParser()
        const sessionToken = await parser.parse(token)

        const sessionRepo = new PrismaSessionRepository(fastify.prisma)
        const userRepo = new PrismaUserRepository(fastify.prisma)
        const validateSession = new ValidateSessionUseCase(sessionRepo, userRepo)

        try {
            const user = await validateSession.execute(sessionToken)

            request.user = user.toPublicDTO()
        } catch {
            return
        }
    })
}

export default fp(authPlugin, {
    name: 'auth',
    dependencies: ['prisma'],
})
