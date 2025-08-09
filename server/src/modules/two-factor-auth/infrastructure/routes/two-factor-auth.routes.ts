import { FastifyInstance } from 'fastify'
import { getTotpSetupDataRoute } from './get-totp-setup-data.route.ts'
import { completeTotpSetupRoute } from './complete-totp-setup.route.ts'

// Prefix: /api/two-factor-auth
const twoFactorAuthRoutes = async (fastify: FastifyInstance) => {
    await Promise.all([
        getTotpSetupDataRoute(fastify),
        completeTotpSetupRoute(fastify)
    ])
}

export default twoFactorAuthRoutes