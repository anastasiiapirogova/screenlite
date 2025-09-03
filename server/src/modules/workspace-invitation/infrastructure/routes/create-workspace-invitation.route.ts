import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { CreateWorkspaceInvitationUsecase } from '../../application/usecases/create-workspace-invitation.usecase.ts'
import z from 'zod'
import { WorkspaceInvitationMapper } from '../mappers/workspace-invitation.mapper.ts'

// Prefix: /api/workspace-invitations
export const createWorkspaceInvitationRoute = async (fastify: FastifyInstance) => {
    fastify.withTypeProvider<ZodTypeProvider>().post('/', {
        schema: {
            body: z.object({
                workspaceId: z.string(),
                email: z.string(),
            }),
        },
        handler: async (request, reply) => {
            const { workspaceId, email } = request.body

            const workspaceInvitationMapper = new WorkspaceInvitationMapper()

            const createWorkspaceInvitationUseCase = new CreateWorkspaceInvitationUsecase({
                workspaceInvitationRepository: fastify.workspaceInvitationRepository,
                workspaceAccessService: fastify.workspaceAccessService,
                workspaceInvitationService: fastify.workspaceInvitationService,
                workspaceRepository: fastify.workspaceRepository,
                initiatorService: fastify.initiatorService,
                workspaceInvariantsService: fastify.workspaceInvariantsService,
            })

            const invitation = await createWorkspaceInvitationUseCase.execute({
                authContext: request.auth,
                workspaceId,
                email,
            })

            return reply.status(201).send({
                invitation: workspaceInvitationMapper.toDTO(invitation)
            })
        }
    })
}