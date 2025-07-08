import { ResponseHandler } from '@/utils/ResponseHandler.ts'
import { Request, Response, NextFunction } from 'express'

export const twoFactorAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.twoFactorEnabled) {
        return next()
    }

    if (!req.user.hasPassedTwoFactorAuth) {
        return ResponseHandler.forbidden(req, res)
    }

    return next()
}
