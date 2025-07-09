import { createGuestRoute, HttpMethod } from '@/routes/utils.ts'
import ConfigController from './controllers/index.ts'

createGuestRoute({
    method: HttpMethod.GET,
    path: '/config',
    handler: ConfigController.getConfig
})