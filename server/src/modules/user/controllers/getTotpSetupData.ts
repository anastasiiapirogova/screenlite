import { ResponseHandler } from '@utils/ResponseHandler.js'
import { TotpService } from '@modules/totp/services/TotpService.js'
import { UserRepository } from '../repositories/UserRepository.js'
import { Request, Response } from 'express'

const ISSUER_NAME = 'Screenlite'

export const getTotpSetupData = async (req: Request, res: Response) => {
    const user = req.user!

    if (user.twoFactorEnabled) {
        return ResponseHandler.forbidden(res, 'TWO_FACTOR_ALREADY_ENABLED')
    }

    const secret = TotpService.generateSecret()
    const encryptedSecret = TotpService.encryptSecret(secret)

    await UserRepository.updateUserTotpSecret(user.id, encryptedSecret)

    const authUrl = TotpService.getOtpAuthUrl(secret, user.email, ISSUER_NAME)

    return ResponseHandler.json(res, {
        secret,
        authUrl
    })
}
