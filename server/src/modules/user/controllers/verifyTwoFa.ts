import { ResponseHandler } from '@utils/ResponseHandler.js'
import { TotpService } from '@modules/totp/services/TotpService.js'
import { UserRepository } from '../repositories/UserRepository.js'
import { Request, Response } from 'express'
import { verifyTwoFaSchema } from '../schemas/userSchemas.js'
import { SessionRepository } from '@modules/session/repositories/SessionRepository.js'

export const verifyTwoFa = async (req: Request, res: Response) => {
    const user = req.user!

    if (!user.twoFactorEnabled) {
        return ResponseHandler.forbidden(req, res, 'TWO_FACTOR_NOT_ENABLED')
    }

    const dbUser = await UserRepository.getUserWithTotpSecret(user.id)

    if (!dbUser) {
        return ResponseHandler.notFound(req, res)
    }

    if (!dbUser.totpSecret) {
        return ResponseHandler.validationError(req, res, {
            token: 'TOTP_SECRET_NOT_SET'
        })
    }

    const validation = verifyTwoFaSchema.safeParse(req.body)

    if (!validation.success) {
        return ResponseHandler.zodError(req, res, validation.error.errors)
    }

    const { token } = validation.data

    const secret = TotpService.decryptSecret(dbUser.totpSecret)

    const isValid = TotpService.verifyToken(secret, token)

    if (!isValid) {
        return ResponseHandler.validationError(req, res, {
            token: 'INVALID_TOTP_TOKEN'
        })
    }

    const updatedUserData = await UserRepository.enableTwoFactor(user.id)

    await SessionRepository.setTwoFaVerified(req.token!)

    return ResponseHandler.json(res, {
        user: {
            ...updatedUserData,
            hasPassedTwoFactorAuth: true
        }
    })
}