
import { UserMapper } from '@/modules/user/infrastructure/mappers/user.mapper.ts'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'

export const meRoute = async (fastify: FastifyInstance) => {
    fastify.withTypeProvider<ZodTypeProvider>().get('/me', {}, async (request, reply) => {
        const userMapper = new UserMapper()

        const user = request.auth?.isUserContext() ? userMapper.toPublicDTO(request.auth.user) : null

        return reply.status(200).send({
            user,
            twoFactorAuthEnabled: request.auth?.isUserContext() && request.auth.twoFactorAuthEnabled,
            twoFactorAuthenticated: request.auth?.isUserContext() && request.auth.twoFactorAuthenticated,
        })
    })
}