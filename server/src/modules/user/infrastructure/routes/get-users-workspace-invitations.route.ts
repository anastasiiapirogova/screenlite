import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'
import { paginationSchema } from '@/shared/schemas/pagination.schema.ts'
import { WorkspaceInvitationStatus } from '@/core/enums/workspace-invitation-status.enum.ts'
import { GetWorkspaceInvitationsByUserDTO } from '@/modules/workspace-invitation/application/dto/get-workspace-invitations-by-user.dto.ts'
import { GetWorkspaceInvitationsByUserUsecase } from '@/modules/workspace-invitation/application/usecases/get-workspace-invitations-by-user.usecase.ts'

// Prefix: /api/users
export const getUsersWorkspaceInvitationsRoute = async (fastify: FastifyInstance) => {
    fastify.withTypeProvider<ZodTypeProvider>().get(
        '/:userId/workspace-invitations',
        {
            schema: {
                params: z.object({
                    userId: z.uuid()
                }),
                querystring: paginationSchema.extend({
                    status: z.array(z.enum(WorkspaceInvitationStatus)).optional().default([WorkspaceInvitationStatus.PENDING]),
                })
            }
        },
        async (request, reply) => {
            const userId = request.params.userId
            const { page, limit, status } = request.query

            const dto: GetWorkspaceInvitationsByUserDTO = {
                userId,
                authContext: request.auth,
                queryOptions: {
                    filters: {
                        status,
                    },
                    pagination: {
                        page,
                        limit
                    }
                }
            }

            const getWorkspaceInvitationsByUser = new GetWorkspaceInvitationsByUserUsecase({
                userRepository: fastify.userRepository,
                workspaceInvitationsWithWorkspaceQuery: fastify.workspaceInvitationsWithWorkspaceQuery,
            })

            const result = await getWorkspaceInvitationsByUser.execute(dto)

            return reply.status(200).send(result)
        }
    )
}