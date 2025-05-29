import { Request, Response } from 'express'
import { exclude } from '../../utils/exclude.js'
import { ResponseHandler } from '@utils/ResponseHandler.js'
import { SessionRepository } from './repositories/SessionRepository.js'
import { SessionPolicy } from './policies/sessionPolicy.js'

export const activeSessions = async (req: Request, res: Response) => {
    const userId = req.params.id
    const user = req.user!
    const token = req.token!

    const allowed = SessionPolicy.canAccessUserSessions(user, userId)

    if (!allowed) {
        return ResponseHandler.forbidden(res)
    }

    const sessions = await SessionRepository.getUserSessions(userId)

    const safeSessions = sessions.map(session => {
        if (session.token !== token) {
            return exclude(session, ['token'])
        }

        return session
    })

    ResponseHandler.json(res, {
        sessions: safeSessions
    })
}