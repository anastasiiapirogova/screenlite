import { Request, Response } from 'express'
import { ResponseHandler } from '@/utils/ResponseHandler.ts'

export const notFoundHandler = (req: Request, res: Response) => {
    ResponseHandler.notFound(req, res, 'ENDPOINT_NOT_FOUND')
}