import { Request, Response } from 'express'
import { exclude } from '../../../utils/exclude.js'
import { ResponseHandler } from '@utils/ResponseHandler.js'
import { SessionRepository } from '@modules/session/repositories/SessionRepository.js'
import { getIpAndUserAgent } from '@modules/user/utils/getIpAndUserAgent.js'
import { signupSchema } from '../schemas/authSchemas.js'
import { UserRepository } from '@modules/user/repositories/UserRepository.js'

export const signup = async (req: Request, res: Response): Promise<void> => {
    const validation = await signupSchema.safeParseAsync(req.body)

    if (!validation.success) {
        return ResponseHandler.zodError(req, res, validation.error.errors)
    }

    const { email, name, password } = validation.data

    const user = await UserRepository.createUser(email, name, password)
	
    const { ipAddress, userAgent } = getIpAndUserAgent(req)

    const session = await SessionRepository.createSession(user.id, userAgent, ipAddress || '')

    return ResponseHandler.created(res, {
        user: exclude(user, ['password']),
        token: session.token,
    })
}
