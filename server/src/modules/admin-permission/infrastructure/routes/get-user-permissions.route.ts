import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { GetUserAdminPermissionsUseCase } from '@/modules/admin-permission/application/usecases/get-user-admin-permissions.usecase.ts'
import { PrismaUserAdminPermissionRepository } from '@/modules/admin-permission/infrastructure/repositories/prisma-user-admin-permission.repository.ts'

const getUserPermissionsSchema = z.object({
    userId: z.uuid()
})

export const getUserPermissionsRoute = async (fastify: FastifyInstance) => {
    fastify.withTypeProvider<ZodTypeProvider>().get('/user/:userId', {
        schema: {
            params: getUserPermissionsSchema
        },
    }, async (request, reply) => {
        const { userId } = request.params

        const getUserPermissions = new GetUserAdminPermissionsUseCase(
            new PrismaUserAdminPermissionRepository(fastify.prisma)
        )

        const permissions = await getUserPermissions.execute(userId)

        return reply.status(200).send({
            userId,
            permissions
        })
    })
} 