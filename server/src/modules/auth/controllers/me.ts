import { ResponseHandler } from '@utils/ResponseHandler.js'
import { Request, Response } from 'express'

export const me = async (req: Request, res: Response) => {
    const user = req.user!

    return ResponseHandler.json(res, {
        user,
    })
}