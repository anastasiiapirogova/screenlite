import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { AdminPermissionName } from '@/core/enums/admin-permission-name.enum.ts'
import { SetUserAdminPermissionsUseCase } from '@/modules/admin-permission/application/usecases/set-user-admin-permissions.usecase.ts'
import { PrismaUserAdminPermissionRepository } from '@/modules/admin-permission/infrastructure/repositories/prisma-user-admin-permission.repository.ts'
import z from 'zod'

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

        const setPermissions = new SetUserAdminPermissionsUseCase(
            new PrismaUserAdminPermissionRepository(fastify.prisma)
        )

        const result = await setPermissions.execute(userId, permissions)

        return reply.status(200).send({
            userId: result.userId,
            permissions: result.permissions
        })
    })
} 