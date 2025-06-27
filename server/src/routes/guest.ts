import { createGuestRoute, HttpMethod } from './utils.ts'
import AuthController from '@/modules/auth/controllers/index.ts'
import UserController from '@/modules/user/controllers/index.ts'
import { ResponseHandler } from '@/utils/ResponseHandler.ts'
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