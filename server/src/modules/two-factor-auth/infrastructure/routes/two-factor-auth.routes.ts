import { FastifyInstance } from 'fastify'
import { getTotpSetupDataRoute } from './get-totp-setup-data.route.ts'
import { completeTotpSetupRoute } from './complete-totp-setup.route.ts'
import { getTwoFactorMethodsRoute } from './get-two-factor-methods.route.ts'
import { completeTotpTwoFactorAuthRoute } from './complete-totp-two-factor-auth.route.ts'

// Prefix: /api/two-factor-auth
const twoFactorAuthRoutes = async (fastify: FastifyInstance) => {
    const routes = [
        getTotpSetupDataRoute,
        completeTotpSetupRoute,
        getTwoFactorMethodsRoute,
        completeTotpTwoFactorAuthRoute,
    ]
    
    for (const route of routes) {
        await route(fastify)
    }
}

export default twoFactorAuthRoutes