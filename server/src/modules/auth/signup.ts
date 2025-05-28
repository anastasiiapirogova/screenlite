import { Request, Response } from 'express'
import { z } from 'zod'
import { hashPassword } from '../user/utils/hashPassword.js'
import { authEventEmitter } from '../../events/eventEmitter.js'
import { exclude } from '../../utils/exclude.js'
import { ResponseHandler } from '@utils/ResponseHandler.js'
import { prisma } from '@config/prisma.js'
import { SessionRepository } from '@modules/session/repositories/SessionRepository.js'
import { passwordZodSchema } from '@modules/user/schemas/passwordSchema.js'
import { getIpAndUserAgent } from '@modules/user/utils/getIpAndUserAgent.js'
import { UserRepository } from '@modules/user/repositories/UserRepository.js'

const userSchema = z.object({
    email: z.string()
        .email('Invalid email address')
        .refine(async (email) => {
            const doesUserExist = await UserRepository.findUserByEmail(email)

            return !doesUserExist
        }, 'This email is already in our database'),
    name: z.string().min(1, 'Name is required'),
    password: passwordZodSchema,
})

export const signup = async (req: Request, res: Response): Promise<void> => {
    const validation = await userSchema.safeParseAsync(req.body)

    if (!validation.success) {
        return ResponseHandler.zodError(req, res, validation.error.errors)
    }

    const { email, name, password } = validation.data

    const hashedPassword = await hashPassword(password)

    const user = await prisma.user.create({
        data: {
            email,
            name,
            password: hashedPassword,
        },
    })

    const { ipAddress, userAgent } = getIpAndUserAgent(req)

    const session = await SessionRepository.createSession(user.id, userAgent, ipAddress || '')

    authEventEmitter.emit('userSignedUp', user)

    return ResponseHandler.created(res, {
        user: exclude(user, ['password']),
        token: session.token,
    })
}
