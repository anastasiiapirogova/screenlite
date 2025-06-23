import { createGuestRoute, HttpMethod } from './utils.js'
import AuthController from '@/modules/auth/controllers/index.js'
import UserController from '@/modules/user/controllers/index.js'
import { ResponseHandler } from '@/utils/ResponseHandler.js'
import { Request, Response } from 'express'

const health = async (req: Request, res: Response) => {
    return ResponseHandler.ok(res)
}

createGuestRoute({
    method: HttpMethod.GET,
    path: '/health',
    handler: health
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
    path: '/user/verifyEmail',
    handler: UserController.verifyEmail
})