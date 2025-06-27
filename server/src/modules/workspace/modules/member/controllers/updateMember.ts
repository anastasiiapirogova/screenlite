import { Request, Response } from 'express'
import { ResponseHandler } from '@/utils/ResponseHandler.ts'

export const updateMember = async (req: Request, res: Response) => {
    return ResponseHandler.ok(res)
}
