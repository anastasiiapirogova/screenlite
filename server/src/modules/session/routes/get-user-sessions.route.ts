import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'
import { GetSessionsUsecase } from '../application/usecases/get-sessions.usecase.ts'
import { PrismaSessionRepository } from '../infrastructure/repositories/prisma-session.repository.ts'
import { paginationSchema } from '@/shared/schemas/pagination.schema.ts'
import { SessionMapper } from '../infrastructure/mappers/session.mapper.ts'

// Prefix: /api/sessions
export const getUserSessionsRoute = async (fastify: FastifyInstance) => {
    fastify.withTypeProvider<ZodTypeProvider>().get(
        '/users/:userId',
        {
            schema: {
                params: z.object({
                    userId: z.uuid()
                }),
                querystring: paginationSchema.extend({
                    onlyActive: z.stringbool().optional(),
                    onlyTerminated: z.stringbool().optional(),
                })
            },
        },
        async (request, reply) => {
            const userId = request.params.userId
            const { onlyActive, onlyTerminated, page, limit } = request.query
            const sessionMapper = new SessionMapper()

            const usecase = new GetSessionsUsecase(
                new PrismaSessionRepository(fastify.prisma)
            )

            const result = await usecase.execute(request.auth, {
                filters: {
                    userId,
                    onlyActive,
                    onlyTerminated,
                },
                pagination: {
                    page,
                    limit,
                },
            })

            return reply.status(200).send({
                items: result.items.map(item => sessionMapper.toPublicDTO(item)),
                meta: result.meta,
            })
        }
    )
} 