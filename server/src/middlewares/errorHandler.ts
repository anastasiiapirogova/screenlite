import { NextFunction, Request, Response } from 'express'
import { ResponseHandler } from '@utils/ResponseHandler.js'

export const errorHandler = (error: Error & { type?: string, status?: number }, req: Request, res: Response, next: NextFunction) => {
    if (res.headersSent) {
        return next(error)
    }

    if (
        error.name === 'PayloadTooLargeError' ||
        error.type === 'entity.too.large' ||
        error.status === 413
    ) {
        return ResponseHandler.tooLarge(req, res) 
    }

    console.error(error.stack)
    ResponseHandler.serverError(req, res)
}