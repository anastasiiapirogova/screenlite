import { ResponseHandler } from '@/utils/ResponseHandler.ts'
import { Request, Response } from 'express'

export const health = async (req: Request, res: Response) => {
    return ResponseHandler.ok(res)
}