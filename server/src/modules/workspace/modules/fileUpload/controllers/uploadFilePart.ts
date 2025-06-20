import { ResponseHandler } from '@utils/ResponseHandler.js'
import { Request, Response } from 'express'
import { MultipartFileUploader } from '@config/storage.js'
import { UploadSessionManager } from '../utils/UploadSessionManager.js'
import { IdleTimeoutManager } from '../utils/IdleTimeoutManager.js'
import { FileUploadSessionValidator } from '../utils/FileUploadSessionValidator.js'
import { ContentLengthValidator } from '../utils/ContentLengthValidator.js'

const MAX_IDLE_TIME_MS = 10000 // 10 seconds

export const uploadFilePart = async (req: Request, res: Response): Promise<void> => {
    const fileUploadSession = await FileUploadSessionValidator.validate(req, res)

    if (!fileUploadSession) return

    const contentLength = ContentLengthValidator.validate(req, res, fileUploadSession)

    if (!contentLength) return

    const idleManager = new IdleTimeoutManager(req, MAX_IDLE_TIME_MS)

    idleManager.setupEventListeners()

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
            console.log('completed')
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

        ResponseHandler.serverError(req, res, 'FAILED_TO_UPLOAD_FILE_PART')
    } finally {
        idleManager.cleanup()
    }
}
