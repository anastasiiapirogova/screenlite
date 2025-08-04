import { ForbiddenError } from '@/shared/errors/forbidden.error.ts'
import { ValidationError } from '@/shared/errors/validation.error.ts'
import { Prisma } from '@/generated/prisma/client.ts'
import { FastifyPluginAsync } from 'fastify'
import fp from 'fastify-plugin'

const errorHandler: FastifyPluginAsync = async (fastify) => {
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

            return
        }
        
        if (error.validation) {
            const errors = error.validation.map(err => ({
                field: err.instancePath.substring(1).replace(/\//g, '.') || err.params.missingProperty,
                message: err.message,
                code: err.keyword
            }))
        
            reply.code(400).send({
                statusCode: 400,
                error: 'Bad Request',
                code: 'FST_ERR_VALIDATION',
                message: 'Validation error',
                errors
            })

            return
        }

        if (error instanceof ValidationError) {
            reply.code(400).send({
                statusCode: 400,
                error: 'Bad Request',
                code: 'FST_ERR_VALIDATION',
                message: 'Validation error',
                errors: error.details,
            })

            return
        }

        if (error instanceof ForbiddenError) {
            reply.code(403).send({
                statusCode: 403,
                error: 'Forbidden',
                code: 'FST_ERR_FORBIDDEN',
                message: 'Forbidden error',
                errors: error.details,
            })

            return
        }

        reply.send(error)
    })
}

export default fp(errorHandler, {
    name: 'errorHandler',
})