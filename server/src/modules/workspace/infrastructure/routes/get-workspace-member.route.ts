import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'
import { GetWorkspaceMemberByUserUsecase } from '@/modules/workspace-member/application/usecases/get-workspace-member-by-user.usecase.ts'
import { WorkspaceMemberMapper } from '@/modules/workspace-member/infrastructure/mappers/workspace-member.mapper.ts'

// Prefix: /api/workspaces
export const getWorkspaceMembersRoute = async (fastify: FastifyInstance) => {
    fastify.withTypeProvider<ZodTypeProvider>().get('/:workspaceId/members/:userId', {
        schema: {
            params: z.object({
                workspaceId: z.uuid(),
                userId: z.uuid(),
            }),
        },
        handler: async (request, reply) => {
            const { workspaceId, userId } = request.params

            const workspaceMemberMapper = new WorkspaceMemberMapper()

            const getWorkspaceMemberUseCase = new GetWorkspaceMemberByUserUsecase(
                {
                    workspaceRepository: fastify.workspaceRepository,
                    workspaceAccessService: fastify.workspaceAccessService,
                    workspaceMemberRepository: fastify.workspaceMemberRepository
                }
            )

            const result = await getWorkspaceMemberUseCase.execute({
                authContext: request.auth,
                workspaceId,
                userId
            })

            return reply.status(200).send({
                member: workspaceMemberMapper.toDTO(result)
            })
        }
    })
}