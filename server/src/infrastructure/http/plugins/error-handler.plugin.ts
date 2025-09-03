import { ForbiddenError } from '@/shared/errors/forbidden.error.ts'
import { ValidationError } from '@/shared/errors/validation.error.ts'
import { Prisma } from '@/generated/prisma/client.ts'
import { FastifyPluginAsync } from 'fastify'
import fp from 'fastify-plugin'
import { ZodError } from 'zod'
import { NotFoundError } from '@/shared/errors/not-found.error.ts'
import { FileNotFoundError } from '@/infrastructure/storage/errors/file-not-found.error.ts'

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

        if (error instanceof ZodError) {
            const errors = error.issues.map((err) => ({
                field: err.path.join('.'),
                message: err.message,
                code: err.code
            }))

            reply.code(400).send({
                statusCode: 400,
                error: 'Bad Request',
                code: 'FST_ERR_VALIDATION',
                message: 'Validation error',
                errors,
            })

            return
        }

        if (error instanceof FileNotFoundError) {
            reply.code(404).send({
                statusCode: 404,
                error: 'Not Found',
                code: 'FST_ERR_NOT_FOUND',
                message: error.message,
            })
        }

        if (error instanceof ValidationError) {
            const errors = Object.entries(error.details).map(([field, messages]) => ({
                field,
                message: messages[0],
                code: 'custom'
            }))
            
            reply.code(400).send({
                statusCode: 400,
                error: 'Bad Request',
                code: 'FST_ERR_VALIDATION',
                message: 'Validation error',
                errors,
            })

            return
        }

        if (error instanceof ForbiddenError) {
            reply.code(403).send({
                statusCode: 403,
                error: 'Forbidden',
                code: error.code,
                message: error.message,
                details: error.details,
            })

            return
        }

        if (error instanceof NotFoundError) {
            reply.code(404).send({
                statusCode: 404,
                error: 'Not Found',
                code: 'FST_ERR_NOT_FOUND',
                message: error.message,
            })

            return
        }

        reply.send(error)
    })
}

export default fp(errorHandler, {
    name: 'errorHandler',
})