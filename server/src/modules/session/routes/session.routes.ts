import { FastifyInstance } from 'fastify'
import { getUserSessionsRoute } from './get-user-sessions.route.ts'
import { getSessionRoute } from './get-session.route.ts'

// Prefix: /api/sessions
const sessionRoutes = async (fastify: FastifyInstance) => {
    await Promise.all([
        getUserSessionsRoute(fastify),
        getSessionRoute(fastify),
    ])
}

export default sessionRoutes