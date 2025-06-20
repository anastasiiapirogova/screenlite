import { ResponseHandler } from '@utils/ResponseHandler.js'
import { UserRepository } from '../repositories/UserRepository.js'
import { Request, Response } from 'express'
import { SessionRepository } from '@modules/session/repositories/SessionRepository.js'

export const disableTwoFa = async (req: Request, res: Response) => {
    const user = req.user!

    if (!user.twoFactorEnabled) {
        return ResponseHandler.forbidden(req, res, 'TWO_FACTOR_NOT_ENABLED')
    }

    const updatedUserData = await UserRepository.disableTwoFactor(user.id)

    await SessionRepository.clearTwoFaVerified(user.id)

    return ResponseHandler.json(res, {
        user: {
            ...updatedUserData,
            hasPassedTwoFactorAuth: false
        }
    })
}
