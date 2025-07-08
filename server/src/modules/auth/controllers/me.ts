import { ResponseHandler } from '@/utils/ResponseHandler.ts'
import { Request, Response } from 'express'

export const me = async (req: Request, res: Response) => {
    return ResponseHandler.json(res, {
        user: req.user
    })
}