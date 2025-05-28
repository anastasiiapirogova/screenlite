import { deleteSessionByToken } from '@modules/user/utils/deleteSessionByToken.js'
import { Request, Response } from 'express'

export const logout = async (req: Request, res: Response) => {
    await deleteSessionByToken(req.token!)

    res.status(204).send()
}
