import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import multipart from '@fastify/multipart'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { UpdateWorkspaceSchema } from '../schema/update-workspace.schema.ts'
import { UpdateWorkspaceUsecase } from '../../application/usecases/update-workspace.usecase.ts'
import { WorkspaceMapper } from '../mappers/workspace.mapper.ts'

// Prefix: /api/workspaces
export const updateWorkspaceRoute = async (fastify: FastifyInstance) => {
    await fastify.register(multipart)

    fastify.withTypeProvider<ZodTypeProvider>().patch('/:workspaceId', {
        schema: {
            params: z.object({
                workspaceId: z.string()
            })
        }
    }, async (request, reply) => {
        const multipartData = await fastify.validateMultipart(request, UpdateWorkspaceSchema.omit({ picture: true }), {
            picture: {
                maxFileSize: 1024 * 1024 * 5,
                optional: true
            }
        })

        const workspaceMapper = new WorkspaceMapper()

        const { picture, name, removePicture, slug } = UpdateWorkspaceSchema.parse(multipartData)

        const updateWorkspaceUsecase = new UpdateWorkspaceUsecase({
            storage: fastify.storage,
            workspaceRepository: fastify.workspaceRepository,
            imageValidator: fastify.imageValidator,
            imageProcessor: fastify.imageProcessor,
            unitOfWork: fastify.unitOfWork,
            jobProducer: fastify.jobProducer,
            workspaceAccessService: fastify.workspaceAccessService,
            workspaceInvariantsService: fastify.workspaceInvariantsService
        })

        const result = await updateWorkspaceUsecase.execute({
            workspaceId: request.params.workspaceId,
            name,
            slug,
            pictureBuffer: picture,
            removePicture,
            authContext: request.auth
        })

        return reply.status(200).send({
            workspace: workspaceMapper.toDTO(result)
        })
    })
}