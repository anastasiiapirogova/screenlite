import { Request, Response } from 'express'
import { ResponseHandler } from '@utils/ResponseHandler.js'
import { SessionRepository } from '@modules/session/repositories/SessionRepository.js'
import { UserRepository } from '@modules/user/repositories/UserRepository.js'
import { loginSchema } from '../schemas/authSchemas.js'
import { rateLimiter } from '@config/rateLimiter.js'
import { setRateLimitHeaders } from '@utils/setRateLimiterHeaders.js'
import { getIpAndUserAgent } from '@modules/user/utils/getIpAndUserAgent.js'
import { UserService } from '@modules/user/utils/UserService.js'
import { generateOpaqueToken } from '@modules/user/utils/generateOpaqueToken.js'

const RATE_LIMIT_KEY = 'login_attempt'

export const login = async (req: Request, res: Response): Promise<void> => {
    const parsedData = loginSchema.safeParse(req.body)

    if (!parsedData.success) {
        return ResponseHandler.zodError(req, res, parsedData.error.errors)
    }

    const rateLimiterResponse = await rateLimiter.check(RATE_LIMIT_KEY, req)

    setRateLimitHeaders(res, rateLimiterResponse)

    if (!rateLimiterResponse.allowed) {
        return ResponseHandler.tooManyRequests(req, res)
    }

    const { email, password } = parsedData.data

    const user = await UserRepository.findUserToAuthenticate(email)

    if (!user) {
        return ResponseHandler.validationError(req, res, { email: 'USER_NOT_FOUND' })
    }

    const isPasswordValid = await UserService.validatePassword(password, user.password)

    if (!isPasswordValid) {
        return ResponseHandler.validationError(req, res, { password: 'INCORRECT_PASSWORD' })
    }

    await rateLimiter.reset(RATE_LIMIT_KEY, req)

    const { ipAddress, userAgent } = getIpAndUserAgent(req)

    const token = generateOpaqueToken()

    const session = await SessionRepository.createSession(user.id, token, userAgent, ipAddress || '')

    return ResponseHandler.json(res, {
        user,
        token: session.token,
    })
}
