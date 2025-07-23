import { FastifyInstance } from 'fastify'
import { healthRoutes } from './health.routes.ts'
import settingRoutes from '@/modules/setting/infrastructure/routes/setting.routes.ts'
import authRoutes from '@/modules/auth/infrastructure/routes/auth.routes.ts'
import userRoutes from '@/modules/user/infrastructure/repositories/routes/user.routes.ts'

export async function registerRoutes(app: FastifyInstance) {
    app.register(settingRoutes, { prefix: '/api/settings' })
    app.register(healthRoutes, { prefix: '/api/health' })
    app.register(authRoutes, { prefix: '/api/auth' })
    app.register(userRoutes, { prefix: '/api/users' })
}