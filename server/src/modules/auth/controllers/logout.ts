import { deleteSessionByToken } from '@modules/user/utils/deleteSessionByToken.js'
import { ResponseHandler } from '@utils/ResponseHandler.js'
import { Request, Response } from 'express'

export const logout = async (req: Request, res: Response) => {
    await deleteSessionByToken(req.token!)

    ResponseHandler.empty(res)
}
