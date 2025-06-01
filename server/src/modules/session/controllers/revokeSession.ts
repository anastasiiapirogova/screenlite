import { Request, Response } from 'express'
import { ResponseHandler } from '@utils/ResponseHandler.js'
import { SessionRepository } from '../repositories/SessionRepository.js'
import { SessionPolicy } from '../policies/sessionPolicy.js'
import { revokeSessionSchema } from '../schemas/sessionSchema.js'

export const revokeSession = async (req: Request, res: Response) => {
    const parsedData = revokeSessionSchema.safeParse(req.body)

    if (!parsedData.success) {
        return ResponseHandler.zodError(req, res, parsedData.error.errors)
    }

    const { sessionId } = parsedData.data

    const user = req.user!

    const session = await SessionRepository.getSession(sessionId)

    if (!session) {
        return ResponseHandler.notFound(res)
    }

    const allowed = SessionPolicy.canRevokeSession(user, session.userId)

    if (!allowed) {
        return ResponseHandler.forbidden(res)
    }

    await SessionRepository.revokeSessionByToken(session.token)

    ResponseHandler.ok(res)
}
