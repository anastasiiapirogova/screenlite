import { FastifyPluginAsync } from 'fastify'
import fp from 'fastify-plugin'

const customValidationErrorHandler: FastifyPluginAsync = async (fastify) => {
    fastify.setErrorHandler(async (error, request, reply) => {
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
        } else {
            reply.send(error)
        }
    })
}

export default fp(customValidationErrorHandler, {
    name: 'customValidationErrorHandler',
})