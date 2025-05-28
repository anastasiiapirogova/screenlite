import { Request, Response } from 'express'
import { z } from 'zod'
import { exclude } from '../../utils/exclude.js'
import { validatePassword } from '../user/utils/validatePassword.js'
import { getIpAndUserAgent } from '../user/utils/getIpAndUserAgent.js'
import { ResponseHandler } from '@utils/ResponseHandler.js'
import { SessionRepository } from '@modules/session/repositories/SessionRepository.js'
import { UserRepository } from '@modules/user/repositories/UserRepository.js'

const loginSchema = z.object({
    email: z.string({
        invalid_type_error: 'EMAIL_IS_INVALID',
        required_error: 'EMAIL_IS_REQUIRED'
    }).email('EMAIL_IS_INVALID'),
    password: z.string().nonempty('PASSWORD_IS_REQUIRED'),
})

export const login = async (req: Request, res: Response): Promise<void> => {
    const parsedData = loginSchema.safeParse(req.body)

    if (!parsedData.success) {
        return ResponseHandler.zodError(req, res, parsedData.error.errors)
    }

    const { email, password } = parsedData.data

    const user = await UserRepository.findUserByEmail(email)

    if (!user) {
        return ResponseHandler.validationError(req, res, { email: 'USER_NOT_FOUND' })
    }

    const isPasswordValid = await validatePassword(password, user.password)

    if (!isPasswordValid) {
        return ResponseHandler.validationError(req, res, { password: 'INCORRECT_PASSWORD' })
    }

    const { ipAddress, userAgent } = getIpAndUserAgent(req)

    const session = await SessionRepository.createSession(user.id, userAgent, ipAddress || '')

    return ResponseHandler.json(res, {
        user: exclude(user, ['password']),
        token: session.token,
    })
}
