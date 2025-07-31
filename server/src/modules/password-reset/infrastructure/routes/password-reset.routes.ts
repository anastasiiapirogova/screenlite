import { FastifyInstance } from 'fastify'
import { requestPasswordResetRoute } from './request-password-reset.route.ts'
import { checkPasswordResetTokenRoute } from './check-password-reset-token.route.ts'
import { confirmPasswordResetRoute } from './confirm-password-reset.route.ts'

// Prefix: /api/password-reset
const passwordResetRoutes = async (fastify: FastifyInstance) => {
    await Promise.all([
        requestPasswordResetRoute(fastify),
        checkPasswordResetTokenRoute(fastify),
        confirmPasswordResetRoute(fastify),
    ])
}

export default passwordResetRoutes