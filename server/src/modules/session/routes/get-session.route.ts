import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'
import { GetSessionUsecase } from '../application/usecases/get-session.usecase.ts'
import { SessionMapper } from '../infrastructure/mappers/session.mapper.ts'

export const getSessionRoute = async (fastify: FastifyInstance) => {
    fastify.withTypeProvider<ZodTypeProvider>().get('/:sessionId', {
        schema: {
            params: z.object({
                sessionId: z.uuid(),
            }),
        }
    }, async (request, reply) => {
        const sessionId = request.params.sessionId

        const sessionMapper = new SessionMapper()

        const usecase = new GetSessionUsecase(fastify.sessionRepository)

        const session = await usecase.execute(request.auth, sessionId)

        return reply.status(200).send({
            session: sessionMapper.toPublicDTO(session),
        })
    })
}