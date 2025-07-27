import { PrismaSessionRepository } from '@/modules/session/infrastructure/repositories/prisma-session.repository.ts'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { LogoutUsecase } from '../../application/usecases/logout.usecase.ts'
import { AuthContextType } from '@/core/enums/auth-context-type.enum.ts'

export const logoutRoute = async (fastify: FastifyInstance) => {
    fastify.withTypeProvider<ZodTypeProvider>().post('/logout', {
        preHandler: [fastify.requireAuth]
    }, async (request, reply) => {
        const sessionRepo = new PrismaSessionRepository(fastify.prisma)

        const logout = new LogoutUsecase({
            sessionRepository: sessionRepo,
        })

        let sessionTokenHash = undefined

        if(request.auth?.type === AuthContextType.UserSession) {
            sessionTokenHash = request.auth.session.tokenHash
        }

        if(!sessionTokenHash) {
            throw fastify.httpErrors.unauthorized()
        }

        await logout.execute({
            sessionTokenHash
        })

        return reply.status(200).send()
    })
}