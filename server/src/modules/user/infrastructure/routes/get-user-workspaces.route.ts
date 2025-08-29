import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'
import { GetUserWorkspacesDTO } from '../../application/dto/get-user-workspaces.dto.ts'
import { GetUserWorkspacesUsecase } from '../../application/usecases/get-user-workspaces.usecase.ts'
import { paginationSchema } from '@/shared/schemas/pagination.schema.ts'

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

            const dto: GetUserWorkspacesDTO = {
                userId,
                authContext: request.auth,
                queryOptions: {
                    pagination: {
                        page,
                        limit
                    }
                }
            }

            const getUserWorkspaces = new GetUserWorkspacesUsecase({
                userRepository: fastify.userRepository,
                workspaceMemberRepository: fastify.workspaceMemberRepository,
            })

            const workspaces = await getUserWorkspaces.execute(dto)

            return reply.status(200).send(workspaces)
        }
    )
}