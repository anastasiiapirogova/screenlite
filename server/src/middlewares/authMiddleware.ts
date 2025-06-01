import { SessionRepository } from '@modules/session/repositories/SessionRepository.js'
import { ResponseHandler } from '@utils/ResponseHandler.js'
import { Request, Response, NextFunction } from 'express'

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers['authorization']

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return ResponseHandler.unauthorized(res)
        }

        const token = authHeader.split(' ')[1]

        const sessionData = await SessionRepository.getSessionData(token)

        if (!sessionData) {
            return ResponseHandler.unauthorized(res)
        }

        const { user, session } = sessionData

        const hasPassedTwoFactorAuth = user.twoFactorEnabled && Boolean(session.twoFaVerifiedAt)

        req.user = {
            ...user,
            hasPassedTwoFactorAuth
        }

        req.token = token

        next()
    } catch (error) {
        console.error('authMiddleware middleware error:', error)

        return ResponseHandler.serverError(res)
    }
}