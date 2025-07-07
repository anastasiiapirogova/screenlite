import { createGuestRoute, HttpMethod } from '@/routes/utils.ts'
import HealthController from '@/modules/health/controllers/index.ts'

createGuestRoute({
    method: HttpMethod.GET,
    path: '/health',
    handler: HealthController.health
})