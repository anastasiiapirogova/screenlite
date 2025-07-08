import { SessionRepository } from '@/modules/session/repositories/SessionRepository.ts'
import { ResponseHandler } from '@/utils/ResponseHandler.ts'
import { Request, Response, NextFunction } from 'express'

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers['authorization']

        if (!authHeader || authHeader.length < 8 || authHeader.slice(0, 7) !== 'Bearer ') {
            return ResponseHandler.unauthorized(req, res)
        }

        const token = authHeader.slice(7)

        if (!token) {
            return ResponseHandler.unauthorized(req, res)
        }

        const sessionData = await SessionRepository.getSessionData(token)

        if (!sessionData) {
            return ResponseHandler.unauthorized(req, res)
        }

        const { user, session } = sessionData

        let hasPassedTwoFactorAuth = false

        if (user.twoFactorEnabled) {
            hasPassedTwoFactorAuth = Boolean(session.twoFaVerifiedAt)
        }

        req.user = Object.assign({}, user, { hasPassedTwoFactorAuth })
        req.token = token

        return next()
    } catch (error) {
        console.error('authMiddleware error:', error)
        return ResponseHandler.serverError(req, res)
    }
}