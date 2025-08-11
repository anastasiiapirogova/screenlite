import { FastifyInstance } from 'fastify'
import { getUserSessionsRoute } from './get-user-sessions.route.ts'

// Prefix: /api/sessions
const sessionRoutes = async (fastify: FastifyInstance) => {
    await Promise.all([
        getUserSessionsRoute(fastify),
    ])
}

export default sessionRoutes