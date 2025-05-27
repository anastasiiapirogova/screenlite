import express from 'express'
import { login } from '@modules/auth/login.js'
import { signup } from '@modules/auth/signup.js'
import { verifyEmail } from '@modules/user/verifyEmail.js'
import { asyncHandler } from '@utils/asyncHandler.js'
import { health } from '@modules/health/health.js'

const router = express.Router()

enum HttpMethod {
    GET = 'get',
    POST = 'post'
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createRoute = (method: HttpMethod, path: string, handler: any) => {
    router[method](path, asyncHandler(handler))
}

createRoute(HttpMethod.POST, '/auth/signup', signup)
createRoute(HttpMethod.POST, '/auth/login', login)
createRoute(HttpMethod.POST, '/user/verifyEmail', verifyEmail)
createRoute(HttpMethod.GET, '/health', health)

export { router as guestRoutes }
