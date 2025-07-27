import { AuthorizationService } from '@/core/authorization/authorization.service.ts'
import { UserMapper } from '@/core/mapper/user.mapper.ts'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'

export const meRoute = async (fastify: FastifyInstance) => {
    fastify.withTypeProvider<ZodTypeProvider>().get('/me', {
        preHandler: [fastify.requireAuth]
    }, async (request, reply) => {
        const userMapper = new UserMapper()

        const authService = new AuthorizationService()

        authService.setAuthContext(request.auth)

        const user = authService.currentUser() ? userMapper.toPublicDTO(authService.currentUser()!) : null

        return reply.status(200).send({
            user
        })
    })
} 