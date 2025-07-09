import { Request, Response } from 'express'
import { ResponseHandler } from '@/utils/ResponseHandler.ts'
import { MAX_FOLDER_DEPTH, MAX_UPLOAD_FILE_PART_SIZE, MAX_UPLOAD_FILE_SIZE, supportedMimeTypes } from '@/config/files.ts'

export const getConfig = async (req: Request, res: Response) => {
    return ResponseHandler.json(res, {
        config: {
            frontend: {
                version: '0.0.1',
            },
            backend: {
                version: '0.0.1',
                environment: process.env.NODE_ENV,
            },
            limits: {
                allowedFileTypes: supportedMimeTypes,
                maxFolderDepth: MAX_FOLDER_DEPTH,
                maxUploadFileSize: MAX_UPLOAD_FILE_SIZE,
                maxUploadFilePartSize: MAX_UPLOAD_FILE_PART_SIZE
            },
        }
    })
}
