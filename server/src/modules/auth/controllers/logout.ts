import { SessionRepository } from '@modules/session/repositories/SessionRepository.js'
import { ResponseHandler } from '@utils/ResponseHandler.js'
import { Request, Response } from 'express'

export const logout = async (req: Request, res: Response) => {
    await SessionRepository.revokeSessionByToken(req.token!)

    ResponseHandler.empty(res)
}
