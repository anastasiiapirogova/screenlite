import { Request, Response } from 'express'
import { z } from 'zod'
import { exclude } from '../../utils/exclude.js'
import { validatePassword } from '../user/utils/validatePassword.js'
import { getIpAndUserAgent } from '../user/utils/getIpAndUserAgent.js'
import { ResponseHandler } from '@utils/ResponseHandler.js'
import { findUserByEmail } from '@modules/user/utils/findUserByEmail.js'
import { SessionRepository } from '@modules/session/repositories/SessionRepository.js'

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
        ResponseHandler.zodError(req, res, parsedData.error.errors)
        return
    }

    const { email, password } = parsedData.data

    const user = await findUserByEmail(email)

    if (!user) {
        ResponseHandler.validationError(req, res, { email: 'USER_NOT_FOUND' })
        return
    }

    const isPasswordValid = await validatePassword(password, user.password)

    if (!isPasswordValid) {
        ResponseHandler.validationError(req, res, { password: 'INCORRECT_PASSWORD' })
        return
    }

    const { ipAddress, userAgent } = getIpAndUserAgent(req)

    const session = await SessionRepository.createSession(user.id, userAgent, ipAddress || '')

    return ResponseHandler.json(res, {
        user: exclude(user, ['password']),
        token: session.token,
    })
}
