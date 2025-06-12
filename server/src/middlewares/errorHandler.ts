import { NextFunction, Request, Response } from 'express'
import { ResponseHandler } from '@utils/ResponseHandler.js'

export const errorHandler = (error: Error, _req: Request, res: Response, next: NextFunction) => {
    if (res.headersSent) {
        return next(error)
    }
    console.log(error.stack)
    ResponseHandler.serverError(res)
} 