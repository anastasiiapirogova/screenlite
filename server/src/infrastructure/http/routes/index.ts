import { FastifyInstance } from 'fastify'
import { healthRoutes } from './health.routes.ts'
import settingRoutes from '@/modules/setting/infrastructure/routes/setting.routes.ts'

export async function registerRoutes(app: FastifyInstance) {
    app.register(settingRoutes, { prefix: '/api/settings' })
    app.register(healthRoutes, { prefix: '/api/health' })
}