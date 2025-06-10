import { verifyEmail } from '@modules/user/controllers/verifyEmail.js'
import { health } from '@modules/health/health.js'
import { createGuestRoute, HttpMethod } from './utils.js'
import AuthController from '@modules/auth/controllers/index.js'

createGuestRoute(HttpMethod.POST, '/auth/signup', AuthController.signup)
createGuestRoute(HttpMethod.POST, '/auth/login', AuthController.login)
createGuestRoute(HttpMethod.POST, '/user/verifyEmail', verifyEmail)
createGuestRoute(HttpMethod.GET, '/health', health)