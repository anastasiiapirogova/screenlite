import { Request, Response } from 'express'
import { ResponseHandler } from '@/utils/ResponseHandler.ts'

export const getWorkspace = async (req: Request, res: Response) => {
    const workspace = req.workspace!

    return ResponseHandler.json(res, {
        workspace
    })
}
