
import { UserMapper } from '@/modules/user/infrastructure/mappers/user.mapper.ts'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'

export const meRoute = async (fastify: FastifyInstance) => {
    fastify.withTypeProvider<ZodTypeProvider>().get('/me', {}, async (request, reply) => {
        const userMapper = new UserMapper()

        if (!request.auth?.isUserContext()) {
            return fastify.httpErrors.unauthorized()
        }

        const user = userMapper.toPublicDTO(request.auth.user)

        return reply.status(200).send({
            user,
            sessionId: request.auth.session?.id,
            twoFactorAuthEnabled: request.auth.twoFactorAuthEnabled,
            hasCompletedTwoFactorAuth: request.auth.hasCompletedTwoFactorAuth,
        })
    })
}