import AuthController from '@/modules/auth/controllers/index.ts'
import { createGuestRoute, createRouteWithoutTwoFACheck, HttpMethod } from '@/routes/utils.ts'

createRouteWithoutTwoFACheck({
    method: HttpMethod.GET,
    path: '/auth/me',
    handler: AuthController.me
})

createRouteWithoutTwoFACheck({
    method: HttpMethod.POST,
    path: '/auth/logout',
    handler: AuthController.logout
})

createGuestRoute({
    method: HttpMethod.POST,
    path: '/auth/signup',
    handler: AuthController.signup
})

createGuestRoute({
    method: HttpMethod.POST,
    path: '/auth/login',
    handler: AuthController.login
})

createGuestRoute({
    method: HttpMethod.POST,
    path: '/auth/password/forgot',
    handler: AuthController.forgotPassword
})

createGuestRoute({
    method: HttpMethod.POST,
    path: '/auth/password/reset',
    handler: AuthController.resetPassword
})