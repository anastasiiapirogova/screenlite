import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'
import { paginationSchema } from '@/shared/schemas/pagination.schema.ts'
import { GetWorkspaceMembersByWorkspaceUsecase } from '@/modules/workspace-member/application/usecases/get-workspace-members-by-workspace.usecase.ts'

// Prefix: /api/workspaces
export const getWorkspaceMembersRoute = async (fastify: FastifyInstance) => {
    fastify.withTypeProvider<ZodTypeProvider>().get('/:workspaceId/members', {
        schema: {
            params: z.object({
                workspaceId: z.uuid(),
            }),
            querystring: paginationSchema.extend({
                name: z.string().min(1).max(1000).optional(),
                email: z.string().min(1).max(1000).optional()
            })
        },
        handler: async (request, reply) => {
            const { workspaceId } = request.params
            const { page, limit, name, email } = request.query

            const getWorkspaceMembersUseCase = new GetWorkspaceMembersByWorkspaceUsecase(
                {
                    workspaceRepository: fastify.workspaceRepository,
                    workspaceAccessService: fastify.workspaceAccessService,
                    workspaceMemberRepository: fastify.workspaceMemberRepository,
                    workspaceInvariantsService: fastify.workspaceInvariantsService
                }
            )

            const result = await getWorkspaceMembersUseCase.execute({
                authContext: request.auth,
                queryOptions: {
                    filters: {
                        workspaceId,
                        name,
                        email
                    },
                    pagination: {
                        page,
                        limit
                    }
                }
            })

            return reply.status(200).send(result)
        }
    })
}