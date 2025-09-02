import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'
import { paginationSchema } from '@/shared/schemas/pagination.schema.ts'
import { GetUserWorkspaceInvitationsUsecase } from '../../application/usecases/get-user-workspace-invitations.usecase.ts'
import { GetUserWorkspaceInvitationsDTO } from '../../application/dto/get-user-workspace-invitations.dto.ts'
import { WorkspaceInvitationStatus } from '@/core/enums/workspace-invitation-status.enum.ts'

// Prefix: /api/users
export const getUserWorkspaceInvitationsRoute = async (fastify: FastifyInstance) => {
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

            const dto: GetUserWorkspaceInvitationsDTO = {
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

            const getUserWorkspaceInvitations = new GetUserWorkspaceInvitationsUsecase({
                userRepository: fastify.userRepository,
                workspaceInvitationsWithWorkspaceQuery: fastify.workspaceInvitationsWithWorkspaceQuery,
            })

            const result = await getUserWorkspaceInvitations.execute(dto)

            return reply.status(200).send(result)
        }
    )
}