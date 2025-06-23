import { Request, Response } from 'express'
import { ResponseHandler } from '@/utils/ResponseHandler.js'
import { SessionRepository } from '../repositories/SessionRepository.js'
import { SessionPolicy } from '../policies/sessionPolicy.js'
import { terminateAllSessionsSchema } from '../schemas/sessionSchema.js'

export const terminateAllSessions = async (req: Request, res: Response) => {
    const parsedData = terminateAllSessionsSchema.safeParse(req.body)

    if (!parsedData.success) {
        return ResponseHandler.zodError(req, res, parsedData.error.errors)
    }

    const { userId, excludeSessionId } = parsedData.data

    const user = req.user!

    const allowed = SessionPolicy.canTerminateSession(user, userId)

    if (!allowed) {
        return ResponseHandler.forbidden(req, res)
    }

    await SessionRepository.terminateSessionsByUserId(userId, excludeSessionId)

    ResponseHandler.ok(res)
}
