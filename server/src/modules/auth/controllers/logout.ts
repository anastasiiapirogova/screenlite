import { SessionRepository } from '@/modules/session/repositories/SessionRepository.ts'
import { ResponseHandler } from '@/utils/ResponseHandler.ts'
import { Request, Response } from 'express'

export const logout = async (req: Request, res: Response) => {
    await SessionRepository.terminateSessionByToken(req.token!)

    ResponseHandler.empty(res)
}
