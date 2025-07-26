import { UserMapper } from '@/core/mapper/user.mapper.ts'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'

export const meRoute = async (fastify: FastifyInstance) => {
    fastify.withTypeProvider<ZodTypeProvider>().get('/me', {
        preHandler: [fastify.requireAuth]
    }, async (request, reply) => {
        const userMapper = new UserMapper()

        const user = request.user ? userMapper.toPublicDTO(request.user) : null

        return reply.status(200).send({
            user
        })
    })
} 