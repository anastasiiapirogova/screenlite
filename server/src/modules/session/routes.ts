import SessionController from '@/modules/session/controllers/index.ts'
import { createRoute, HttpMethod } from '@/routes/utils.ts'

createRoute({
    method: HttpMethod.POST,
    path: '/sessions/:sessionId/terminate',
    handler: SessionController.terminateSession
})