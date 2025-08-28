import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { AdminPermissionName } from '@/core/enums/admin-permission-name.enum.ts'
import { SetUserAdminPermissionsUseCase } from '@/modules/admin-permission/application/usecases/set-user-admin-permissions.usecase.ts'
import z from 'zod'

// Prefix: /api/admin/permissions
export const setAdminPermissionsRoute = async (fastify: FastifyInstance) => {
    fastify.withTypeProvider<ZodTypeProvider>().put('/users/:userId', {
        schema: {
            params: z.object({
                userId: z.uuid()
            }),
            body: z.object({
                permissions: z.array(z.enum(AdminPermissionName))
            })
        },
    }, async (request, reply) => {
        const { userId } = request.params
        const { permissions } = request.body

        const authContext = request.auth

        const setPermissions = new SetUserAdminPermissionsUseCase(
            fastify.adminPermissionRepository,
            fastify.userRepository,
            fastify.unitOfWork
        )

        const result = await setPermissions.execute(authContext, userId, permissions)

        return reply.status(200).send({
            userId: result.userId,
            permissions: result.permissions
        })
    })
} 