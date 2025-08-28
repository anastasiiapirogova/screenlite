import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'
import { CreateWorkspaceUsecase } from '../../application/usecases/create-workspace.usecase.ts'
import { workspaceCreationServiceFactory } from '../../domain/services/workspace-creation-service.factory.ts'
import { WorkspaceMapper } from '../mappers/workspace.mapper.ts'
import { workspaceMemberServiceFactory } from '@/modules/workspace-member/domain/services/workspace-member-service.factory.ts'
import { workspaceSlugSchema } from '@/shared/schemas/workspace.schemas.ts'

// Prefix: /api/workspaces
export const createWorkspaceRoute = async (fastify: FastifyInstance) => {
    fastify.withTypeProvider<ZodTypeProvider>().post('/', {
        schema: {
            body: z.object({
                name: z.string(),
                slug: workspaceSlugSchema,
            }),
        },
        handler: async (request, reply) => {
            const { name, slug } = request.body

            const workspaceMapper = new WorkspaceMapper()

            const createWorkspaceUseCase = new CreateWorkspaceUsecase(
                fastify.unitOfWork,
                workspaceCreationServiceFactory,
                workspaceMemberServiceFactory
            )

            const workspace = await createWorkspaceUseCase.execute({
                authContext: request.auth,
                name,
                slug,
            })

            return reply.status(201).send({
                workspace: workspaceMapper.toDTO(workspace)
            })
        }
    })
}