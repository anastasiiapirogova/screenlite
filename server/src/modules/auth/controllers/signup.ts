import { Request, Response } from 'express'
import { ResponseHandler } from '@utils/ResponseHandler.js'
import { SessionRepository } from '@modules/session/repositories/SessionRepository.js'
import { getIpAndUserAgent } from '@modules/user/utils/getIpAndUserAgent.js'
import { signupSchema } from '../schemas/authSchemas.js'
import { UserRepository } from '@modules/user/repositories/UserRepository.js'
import { rateLimiter } from '@config/rateLimiter.js'
import { setRateLimitHeaders } from '@utils/setRateLimiterHeaders.js'

const RATE_LIMIT_KEY = 'signup_attempt'

export const signup = async (req: Request, res: Response): Promise<void> => {
    const validation = await signupSchema.safeParseAsync(req.body)

    if (!validation.success) {
        return ResponseHandler.zodError(req, res, validation.error.errors)
    }

    const rateLimiterResponse = await rateLimiter.check(RATE_LIMIT_KEY, req)

    setRateLimitHeaders(res, rateLimiterResponse)

    if (!rateLimiterResponse.allowed) {
        return ResponseHandler.tooManyRequests(res)
    }

    const { email, name, password } = validation.data

    const user = await UserRepository.createUser(email, name, password)
	
    const { ipAddress, userAgent } = getIpAndUserAgent(req)

    const session = await SessionRepository.createSession(user.id, userAgent, ipAddress || '')

    return ResponseHandler.created(res, {
        user,
        token: session.token,
    })
}
