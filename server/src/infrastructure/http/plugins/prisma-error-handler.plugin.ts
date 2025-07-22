import { Prisma } from '@/generated/prisma/client.ts'
import { FastifyPluginAsync } from 'fastify'
import fp from 'fastify-plugin'

const prismaErrorHandler: FastifyPluginAsync = async (fastify) => {
    fastify.setErrorHandler(async (error, request, reply) => {
        if (
            error instanceof Prisma.PrismaClientInitializationError ||
            (error instanceof Prisma.PrismaClientKnownRequestError && (
                error.code === 'P1001' ||
                error.code === 'P1002' ||
                (typeof error.message === 'string' && error.message.includes('ENOTFOUND'))
            ))
        ) {
            reply.code(503).send({
                statusCode: 503,
                error: 'Service Unavailable',
                code: 'PRISMA_ERR_SERVICE_UNAVAILABLE',
                message: 'Unable to connect to the database.',
            })
        } else {
            reply.send(error)
        }
    })
}

export default fp(prismaErrorHandler, {
    name: 'prismaErrorHandler',
})