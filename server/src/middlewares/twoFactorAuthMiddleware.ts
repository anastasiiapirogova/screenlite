import { ResponseHandler } from '@utils/ResponseHandler.js'
import { Request, Response, NextFunction } from 'express'
import { AuthUser } from 'types.js'

export const twoFactorAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as AuthUser

    if (user.twoFactorEnabled && !user.hasPassedTwoFactorAuth) {
        return ResponseHandler.forbidden(res)
    }

    next()
}
