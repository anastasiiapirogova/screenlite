import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'

export const meRoute = async (fastify: FastifyInstance) => {
    fastify.withTypeProvider<ZodTypeProvider>().get('/me', {
        preHandler: [fastify.requireAuth]
    }, async (request, reply) => {
        return reply.status(200).send({
            user: request.user?.toPublicDTO()
        })
    })
} 