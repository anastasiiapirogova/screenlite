import { z } from 'zod'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { GetUserAdminPermissionsUseCase } from '@/modules/admin-permission/application/usecases/get-user-admin-permissions.usecase.ts'

// Prefix: /api/admin/permissions
export const getUserPermissionsRoute = async (fastify: FastifyInstance) => {
    fastify.withTypeProvider<ZodTypeProvider>().get('/users/:userId', {
        schema: {
            params: z.object({
                userId: z.uuid()
            })
        },
    }, async (request, reply) => {
        const { userId } = request.params

        const authContext = request.auth!

        const getUserPermissions = new GetUserAdminPermissionsUseCase(
            fastify.adminPermissionRepository,
            fastify.userRepository,
        )

        const permissions = await getUserPermissions.execute(authContext, userId)

        return reply.status(200).send({
            permissions
        })
    })
}