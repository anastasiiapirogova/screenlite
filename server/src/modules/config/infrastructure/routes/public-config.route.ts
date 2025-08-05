import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { GetPublicConfigUsecase } from '../../application/usecases/get-public-config.usecase.ts'

// Prefix: /api/config
export async function publicConfigRoute(fastify: FastifyInstance) {
    fastify.withTypeProvider<ZodTypeProvider>().get('/public', {
        config: {
            allowGuest: true,
        }
    }, async (request, reply) => {
        const usecase = new GetPublicConfigUsecase(fastify.config)

        const config = await usecase.execute()

        reply.status(200).send({
            config
        })
    })
}