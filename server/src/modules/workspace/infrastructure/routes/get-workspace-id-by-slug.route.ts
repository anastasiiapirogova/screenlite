import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'
import { workspaceSlugSchema } from '@/shared/schemas/workspace.schemas.ts'
import { GetWorkspaceIdBySlugUsecase } from '../../application/usecases/get-workspace-id-by-slug.usecase.ts'

// Prefix: /api/workspaces
export const getWorkspaceIdBySlugRoute = async (fastify: FastifyInstance) => {
    fastify.withTypeProvider<ZodTypeProvider>().get('/by-slug/:slug/id', {
        schema: {
            params: z.object({
                slug: workspaceSlugSchema,
            }),
        },
        handler: async (request, reply) => {
            const { slug } = request.params

            const getWorkspaceIdBySlugUseCase = new GetWorkspaceIdBySlugUsecase(
                {
                    workspaceRepository: fastify.workspaceRepository,
                    workspaceAccessService: fastify.workspaceAccessService,
                    workspaceInvariantsService: fastify.workspaceInvariantsService
                }
            )

            const workspaceId = await getWorkspaceIdBySlugUseCase.execute(slug, request.auth)

            return reply.status(200).send({
                workspaceId
            })
        }
    })
}