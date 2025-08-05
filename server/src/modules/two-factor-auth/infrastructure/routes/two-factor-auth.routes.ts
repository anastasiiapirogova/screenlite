import { FastifyInstance } from 'fastify'
import { getTwoFactorAuthSetupDataRoute } from './get-two-factor-auth-setup-data.route.ts'

// Prefix: /api/two-factor-auth
const twoFactorAuthRoutes = async (fastify: FastifyInstance) => {
    await Promise.all([
        getTwoFactorAuthSetupDataRoute(fastify)
    ])
}

export default twoFactorAuthRoutes