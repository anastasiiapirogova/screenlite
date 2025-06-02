import { Request, Response } from 'express'
import { ResponseHandler } from '@utils/ResponseHandler.js'
import { SessionRepository } from '../repositories/SessionRepository.js'
import { SessionPolicy } from '../policies/sessionPolicy.js'
import { parseUserAgent } from '../utils/parseUserAgent.js'

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
        return {
            ...session,
            token: session.token === token ? session.token : undefined,
            userAgent: parseUserAgent(session.userAgent)
        }
    })

    ResponseHandler.json(res, {
        sessions: safeSessions
    })
}