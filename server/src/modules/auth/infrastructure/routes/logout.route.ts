import { PrismaSessionRepository } from '@/modules/session/infrastructure/repositories/prisma-session.repository.ts'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { LogoutUsecase } from '../../application/usecases/logout.usecase.ts'

export const logoutRoute = async (fastify: FastifyInstance) => {
    fastify.withTypeProvider<ZodTypeProvider>().post('/logout', {
        config: {
            allowSkipTwoFactorAuth: true,
            allowDeletedUser: true,
        }
    }, async (request, reply) => {
        const sessionRepo = new PrismaSessionRepository(fastify.prisma)

        const logout = new LogoutUsecase({
            sessionRepository: sessionRepo,
        })

        const sessionId = request.auth?.session?.id

        if(!sessionId) {
            throw fastify.httpErrors.unauthorized()
        }

        await logout.execute({
            sessionId
        })

        return reply.status(200).send()
    })
}