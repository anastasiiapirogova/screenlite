import { FastifyInstance } from 'fastify'
import { publicConfigRoute } from './public-config.route.ts'

// Prefix: /api/config
const configRoutes = async (fastify: FastifyInstance) => {
    await Promise.all([
        publicConfigRoute(fastify),
    ])
}

export default configRoutes