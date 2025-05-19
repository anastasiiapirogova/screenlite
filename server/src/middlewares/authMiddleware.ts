import { SessionRepository } from '@modules/session/repositories/SessionRepository.js'
import { ResponseHandler } from '@utils/ResponseHandler.js'
import { Request, Response, NextFunction } from 'express'

export const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers['authorization']

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return ResponseHandler.unauthorized(res)
        }

        const token = authHeader.split(' ')[1]

        const user = await SessionRepository.getSessionUser(token)

        if (!user) {
            return ResponseHandler.unauthorized(res)
        }

        req.user = user

        req.token = token

        next()
    } catch (error) {
        console.error('isAuthenticated middleware error:', error)

        return ResponseHandler.serverError(res)
    }
}