import { ResponseHandler } from '@utils/ResponseHandler.js'
import { Request, Response } from 'express'

export const health = async (req: Request, res: Response) => {
    return ResponseHandler.ok(res)
}