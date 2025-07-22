import { FastifyInstance } from 'fastify'
import { signupRoute } from './signup.route.ts'

// Prefix: /api/auth
const authRoutes = async (fastify: FastifyInstance) => {
    await Promise.all([
        signupRoute(fastify),
    ])
} 

export default authRoutes