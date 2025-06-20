import { ResponseHandler } from '@utils/ResponseHandler.js'
import { Request, Response, NextFunction } from 'express'

export const twoFactorAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const user = req.user!

    if (user.twoFactorEnabled && !user.hasPassedTwoFactorAuth) {
        return ResponseHandler.forbidden(req, res)
    }

    next()
}
