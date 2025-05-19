import { Request, Response } from 'express'
import { Session } from '@prisma/client'
import { SafeUser } from '../../types.js'
import { z } from 'zod'
import { ResponseHandler } from '@utils/ResponseHandler.js'
import { deleteSessionByToken } from '../user/utils/deleteSessionByToken.js'
import { SessionRepository } from './repositories/SessionRepository.js'

const revokeSessionSchema = z.object({
    sessionId: z.string().uuid('Invalid sessionId format. It must be a valid UUID.')
})

const hasPermission = (user: SafeUser, session: Session): boolean => {
    return user.id === session.userId
}

export const revokeSession = async (req: Request, res: Response) => {
    const parsedData = revokeSessionSchema.safeParse(req.body)

    if (!parsedData.success) {
        ResponseHandler.zodError(req, res, parsedData.error.errors)

        return
    }

    const { sessionId } = parsedData.data

    const user = req.user!

    const session = await SessionRepository.getSession(sessionId)

    if (!session) {
        ResponseHandler.notFound(res)
        return
    }

    if (!hasPermission(user, session)) {
        ResponseHandler.forbidden(res)
        return
    }

    await deleteSessionByToken(session.token)

    res.status(200).send()
}
