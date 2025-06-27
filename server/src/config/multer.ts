/* eslint-disable @typescript-eslint/no-explicit-any */
import { ResponseHandler } from '@/utils/ResponseHandler.ts'
import { Request, Response, NextFunction } from 'express'
import multer, { memoryStorage, MulterError } from 'multer'

const upload = multer({
    storage: memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }
})

export const workspaceUpdateMulterMiddleware = upload.single('picture')
export const userUpdateMulterMiddleware = upload.single('profilePhoto')

export function multerErrorHandler(
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) {
    if (err instanceof MulterError) {
        ResponseHandler.validationError(req, res, { [err.field || 'error']: err.code })
        return
    }

    next(err)
}