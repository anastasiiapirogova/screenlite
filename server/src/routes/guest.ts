import express, { RequestHandler } from 'express'
import { verifyEmail } from '@modules/user/controllers/verifyEmail.js'
import { asyncHandler } from '@utils/asyncHandler.js'
import { health } from '@modules/health/health.js'
import { login, signup } from '@modules/auth/controllers/index.js'

const router = express.Router()

enum HttpMethod {
    GET = 'get',
    POST = 'post'
}

const createRoute = (method: HttpMethod, path: string, handler: (req: express.Request, res: express.Response) => Promise<void>, ...middlewares: RequestHandler[]) => {
    router[method](path, ...middlewares, asyncHandler(handler))
}

createRoute(HttpMethod.POST, '/auth/signup', signup)
createRoute(HttpMethod.POST, '/auth/login', login)
createRoute(HttpMethod.POST, '/user/verifyEmail', verifyEmail)
createRoute(HttpMethod.GET, '/health', health)

export { router as guestRoutes }
