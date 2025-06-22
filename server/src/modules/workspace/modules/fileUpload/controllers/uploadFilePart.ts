import { ResponseHandler } from '@utils/ResponseHandler.js'
import { Request, Response } from 'express'
import { MultipartFileUploader } from '@config/storage.js'
import { UploadSessionManager } from '../utils/UploadSessionManager.js'
import { FileUploadSessionValidator } from '../utils/FileUploadSessionValidator.js'
import { ContentLengthValidator } from '../utils/ContentLengthValidator.js'
import { FileRepository } from '../../file/repositories/FileRepository.js'
import { addCompleteMultipartUploadJob } from '../utils/addCompleteMultipartUploadJob.js'
import { Readable } from 'stream'

export const uploadFilePart = async (req: Request, res: Response): Promise<void> => {
    throw new Error('test')
    if(!(req instanceof Readable)) {
        return ResponseHandler.validationError(req, res, {
            file: 'INVALID_REQUEST_BODY'
        })
    }

    const fileUploadSession = await FileUploadSessionValidator.validate(req, res)

    if (!fileUploadSession) return

    const contentLength = ContentLengthValidator.validate(req, res, fileUploadSession)

    if (!contentLength) return

    try {
        const partNumber = Number(fileUploadSession.uploadedParts) + 1

        await MultipartFileUploader.uploadPart(
            fileUploadSession,
            req,
            partNumber
        )

        const updatedSession = await UploadSessionManager.updateSession(
            fileUploadSession,
            contentLength
        )

        if(updatedSession.completedAt) {
            const file = await FileRepository.createFileFromFileUploadSession(updatedSession)

            addCompleteMultipartUploadJob(updatedSession, file.id)
        }

        ResponseHandler.json(res, {
            fileUploadSession: updatedSession
        })
    } catch (error: unknown) {
        if (error instanceof Error && error.message === 'UPLOAD_IDLE_TIMEOUT') {
            ResponseHandler.validationError(req, res, {
                file: 'UPLOAD_IDLE_TIMEOUT'
            })
            return
        }

        throw error
    }
}
