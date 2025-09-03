import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'
import { paginationSchema } from '@/shared/schemas/pagination.schema.ts'
import { GetWorkspaceMembershipsByUserUsecase } from '@/modules/workspace-member/application/usecases/get-workspace-memberships-by-user.usecase.ts'
import { GetWorkspaceMembershipsByUserDTO } from '@/modules/workspace-member/application/dto/get-workspace-memberships-by-user.dto.ts'

// Prefix: /api/users
export const getUserWorkspacesRoute = async (fastify: FastifyInstance) => {
    fastify.withTypeProvider<ZodTypeProvider>().get(
        '/:userId/workspaces',
        {
            schema: {
                params: z.object({
                    userId: z.uuid()
                }),
                querystring: paginationSchema
            }
        },
        async (request, reply) => {
            const userId = request.params.userId
            const { page, limit } = request.query

            const dto: GetWorkspaceMembershipsByUserDTO = {
                userId,
                authContext: request.auth,
                queryOptions: {
                    pagination: {
                        page,
                        limit
                    }
                }
            }

            const getUserMemberships = new GetWorkspaceMembershipsByUserUsecase({
                userRepository: fastify.userRepository,
                workspaceMemberRepository: fastify.workspaceMemberRepository,
            })

            const memberships = await getUserMemberships.execute(dto)

            return reply.status(200).send(memberships)
        }
    )
}