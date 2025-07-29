import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'

// Prefix: /api/admin/permissions
export const resolveAuthContextAdminPermissionsRoute = async (fastify: FastifyInstance) => {
    fastify.withTypeProvider<ZodTypeProvider>().get('/me', {}, async (request, reply) => {
        const authContext = request.auth

        return reply.status(200).send({
            permissions: authContext?.getAdminPermissions()
        })
    })
}