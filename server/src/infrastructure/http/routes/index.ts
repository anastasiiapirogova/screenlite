import { FastifyInstance } from 'fastify'
import healthRoutes from '@/modules/health/infrastructure/routes/health.routes.ts'
import settingRoutes from '@/modules/setting/infrastructure/routes/setting.routes.ts'
import authRoutes from '@/modules/auth/infrastructure/routes/auth.routes.ts'
import userRoutes from '@/modules/user/infrastructure/routes/user.routes.ts'
import emailVerificationRoutes from '@/modules/emailVerification/infrastructure/routes/email-verification.routes.ts'

export async function registerRoutes(fastify: FastifyInstance) {
    fastify.register(healthRoutes, { prefix: '/api/health' })
    fastify.register(authRoutes, { prefix: '/api/auth' })
    fastify.register(userRoutes, { prefix: '/api/users' })
    fastify.register(emailVerificationRoutes, { prefix: '/api/email-verification' })

    fastify.register(async function adminRoutes(fastifyAdmin) {
        fastifyAdmin.addHook('onRequest', fastify.requireAuth)
        fastifyAdmin.addHook('onRequest', fastify.requireAdminAccess)
    
        fastifyAdmin.register(settingRoutes, { prefix: '/settings' })
    }, { prefix: '/api/admin' })
}