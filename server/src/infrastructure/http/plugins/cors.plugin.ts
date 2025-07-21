import fp from 'fastify-plugin'
import { FastifyPluginAsync } from 'fastify'
import cors from '@fastify/cors'

const corsPlugin: FastifyPluginAsync = async (fastify) => {
    fastify.register(cors, {
        origin: fastify.config.app.allowedCorsOrigins,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
        credentials: true
    })
}

export default fp(corsPlugin, {
    name: 'cors',
    dependencies: ['config'],
})