import { ResponseHandler } from '@/utils/ResponseHandler.ts'
import { UserRepository } from '../repositories/UserRepository.ts'
import { Request, Response } from 'express'
import { SessionRepository } from '@/modules/session/repositories/SessionRepository.ts'

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
