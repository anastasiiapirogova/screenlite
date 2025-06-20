import { Request, Response } from 'express'
import { ResponseHandler } from '@utils/ResponseHandler.js'
import { EmailVerificationTokenRepository } from '@modules/emailVerificationToken/repositories/EmailVerificationTokenRepository.js'
import { UserRepository } from '../repositories/UserRepository.js'
import { verifyEmailSchema } from '../schemas/userSchemas.js'

const isNewEmailTaken = async (newEmail: string) => {
    const user = await UserRepository.findUserByEmail(newEmail)

    return !!user
}

export const verifyEmail = async (req: Request, res: Response) => {
    const validation = await verifyEmailSchema.safeParseAsync(req.body)

    if (!validation.success) {
        return ResponseHandler.zodError(req, res, validation.error.errors)
    }

    const { token } = validation.data

    const tokenRecord = await EmailVerificationTokenRepository.checkEmailVerificationToken(token)

    if (!tokenRecord) {
        return ResponseHandler.notFound(req, res)
    }

    const newEmail = tokenRecord.newEmail || undefined

    if (newEmail && await isNewEmailTaken(newEmail)) {
        await EmailVerificationTokenRepository.deleteVerificationTokens(tokenRecord.userId)
        return ResponseHandler.validationError(req, res, { email: 'Email is already taken' })
    }

    const user = await UserRepository.updateUserEmailTransaction(tokenRecord.userId, newEmail)

    return ResponseHandler.json(res, {
        user
    })
}
