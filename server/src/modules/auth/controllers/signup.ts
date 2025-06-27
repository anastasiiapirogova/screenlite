import { Request, Response } from 'express'
import { ResponseHandler } from '@/utils/ResponseHandler.ts'
import { SessionRepository } from '@/modules/session/repositories/SessionRepository.ts'
import { getIpAndUserAgent } from '@/modules/user/utils/getIpAndUserAgent.ts'
import { signupSchema } from '../schemas/authSchemas.ts'
import { UserRepository } from '@/modules/user/repositories/UserRepository.ts'
import { rateLimiter } from '@/config/rateLimiter.ts'
import { setRateLimitHeaders } from '@/utils/rateLimiter/setRateLimiterHeaders.ts'
import { generateOpaqueToken } from '@/modules/user/utils/generateOpaqueToken.ts'

const RATE_LIMIT_KEY = 'signup'

export const signup = async (req: Request, res: Response): Promise<void> => {
    const validation = await signupSchema.safeParseAsync(req.body)

    if (!validation.success) {
        return ResponseHandler.zodError(req, res, validation.error.errors)
    }

    const rateLimiterResponse = await rateLimiter.check(RATE_LIMIT_KEY, req)

    setRateLimitHeaders(res, rateLimiterResponse)

    if (!rateLimiterResponse.allowed) {
        return ResponseHandler.tooManyRequests(req, res)
    }

    const { email, name, password } = validation.data

    const user = await UserRepository.createUser(email, name, password)
	
    const { ipAddress, userAgent } = getIpAndUserAgent(req)

    const token = generateOpaqueToken()

    const session = await SessionRepository.createSession(user.id, token, userAgent, ipAddress || '')

    return ResponseHandler.created(res, {
        user,
        token: session.token,
    })
}
