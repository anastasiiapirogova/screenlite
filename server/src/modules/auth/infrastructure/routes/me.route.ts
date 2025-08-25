import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'

export const meRoute = async (fastify: FastifyInstance) => {
    fastify.withTypeProvider<ZodTypeProvider>().get('/me', {
        config: {
            allowSkipTwoFactorAuth: true,
            allowDeletedUser: true,
        }
    }, async (request, reply) => {
        if (!request.auth?.isUserContext()) {
            return fastify.httpErrors.unauthorized()
        }

        return reply.status(200).send({
            user: request.auth.user,
            session: request.auth.session,
        })
    })
}