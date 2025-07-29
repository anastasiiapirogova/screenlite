import { UserSessionAuthContext } from '@/core/context/user-session-auth.context.ts'
import { UserMapper } from '@/core/mapper/user.mapper.ts'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'

export const meRoute = async (fastify: FastifyInstance) => {
    fastify.withTypeProvider<ZodTypeProvider>().get('/me', {}, async (request, reply) => {
        const userMapper = new UserMapper()

        const user = request.auth?.isUserContext() ? userMapper.toPublicDTO((request.auth as UserSessionAuthContext).user) : null

        return reply.status(200).send({
            user
        })
    })
} 