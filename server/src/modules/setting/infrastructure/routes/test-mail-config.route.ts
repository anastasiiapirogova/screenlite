import { FastifyInstance } from 'fastify'
import { TestMailConfigUsecase } from '../../application/usecases/test-mail-config.usecase.ts'
import { TestMailConfigSchema } from '../schemas/test-mail-config.schema.ts'
import { ZodTypeProvider } from 'fastify-type-provider-zod'

export const testMailConfigRoute = async (fastify: FastifyInstance) => {
    fastify.withTypeProvider<ZodTypeProvider>().post('/mail/test-config', {
        schema: {
            body: TestMailConfigSchema
        },
    }, async (request, reply) => {
        const config = request.body

        const mailService = fastify.mail

        const usecase = new TestMailConfigUsecase(mailService)

        const result = await usecase.execute(config)

        reply.send({ success: result })
    })
}