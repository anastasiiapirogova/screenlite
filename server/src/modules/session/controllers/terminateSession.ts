import { Request, Response } from 'express'
import { ResponseHandler } from '@/utils/ResponseHandler.js'
import { SessionRepository } from '../repositories/SessionRepository.js'
import { SessionPolicy } from '../policies/sessionPolicy.js'
import { terminateSessionSchema } from '../schemas/sessionSchema.js'

export const terminateSession = async (req: Request, res: Response) => {
    const parsedData = terminateSessionSchema.safeParse(req.body)

    if (!parsedData.success) {
        return ResponseHandler.zodError(req, res, parsedData.error.errors)
    }

    const { sessionId } = parsedData.data

    const user = req.user!

    const session = await SessionRepository.getSession(sessionId)

    if (!session) {
        return ResponseHandler.notFound(req, res)
    }

    const allowed = SessionPolicy.canTerminateSession(user, session.userId)

    if (!allowed) {
        return ResponseHandler.forbidden(req, res)
    }

    await SessionRepository.terminateSessionByToken(session.token)

    ResponseHandler.ok(res)
}
