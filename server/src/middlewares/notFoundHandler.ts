import { Request, Response } from 'express'
import { ResponseHandler } from '@utils/ResponseHandler.js'

export const notFoundHandler = (_req: Request, res: Response) => {
    ResponseHandler.notFound(res)
} 