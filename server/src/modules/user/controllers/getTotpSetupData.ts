import { ResponseHandler } from '@/utils/ResponseHandler.js'
import { TotpService } from '@/modules/totp/services/TotpService.js'
import { UserRepository } from '../repositories/UserRepository.js'
import { Request, Response } from 'express'
import { APP_NAME } from '@/config/screenlite.js'

export const getTotpSetupData = async (req: Request, res: Response) => {
    const user = req.user!
    const { userId } = req.params

    if (userId !== user.id) {
        return ResponseHandler.forbidden(req, res)
    }

    if (user.twoFactorEnabled) {
        return ResponseHandler.forbidden(req, res, 'TWO_FACTOR_ALREADY_ENABLED')
    }

    const secret = TotpService.generateSecret()
    const encryptedSecret = TotpService.encryptSecret(secret)

    await UserRepository.updateUserTotpSecret(userId, encryptedSecret)

    const authUrl = TotpService.getOtpAuthUrl(secret, user.email, APP_NAME)

    return ResponseHandler.json(res, {
        secret,
        authUrl
    })
}
