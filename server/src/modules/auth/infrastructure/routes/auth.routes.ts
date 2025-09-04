import { FastifyInstance } from 'fastify'
import { signupRoute } from './signup.route.ts'
import { loginRoute } from './login.route.ts'
import { meRoute } from './me.route.ts'
import { logoutRoute } from './logout.route.ts'

// Prefix: /api/auth
const authRoutes = async (fastify: FastifyInstance) => {
    await Promise.all([
        signupRoute(fastify),
        loginRoute(fastify),
        meRoute(fastify),
        logoutRoute(fastify),
    ])
}

export default authRoutes