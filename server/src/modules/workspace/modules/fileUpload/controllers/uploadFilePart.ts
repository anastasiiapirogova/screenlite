import { ResponseHandler } from '@/utils/ResponseHandler.js'
import { Request, Response } from 'express'
import { MultipartFileUploader } from '@/config/storage.js'
import { UploadSessionManager } from '../utils/UploadSessionManager.js'
import { FileUploadSessionValidator } from '../utils/FileUploadSessionValidator.js'
import { ContentLengthValidator } from '../utils/ContentLengthValidator.js'
import { FileRepository } from '../../file/repositories/FileRepository.js'
import { addCompleteMultipartUploadJob } from '../utils/addCompleteMultipartUploadJob.js'
import { Readable } from 'stream'
import { UploadLockService } from '../services/UploadLockService.js'

export const uploadFilePart = async (req: Request, res: Response): Promise<void> => {
    if(!(req instanceof Readable)) {
        return ResponseHandler.validationError(req, res, {
            file: 'INVALID_REQUEST_BODY'
        })
    }

    const fileUploadSession = await FileUploadSessionValidator.validate(req, res)

    if (!fileUploadSession) return

    const contentLength = ContentLengthValidator.validate(req, res, fileUploadSession)

    if (!contentLength) return

    const partNumber = Number(fileUploadSession.uploadedParts) + 1

    let lockAcquired: { acquired: boolean, lockValue?: string } = { acquired: false }

    try {
        lockAcquired = await UploadLockService.acquireLock(fileUploadSession, partNumber)
        
        if (!lockAcquired.acquired) {
            return ResponseHandler.conflict(req, res, 'PART_UPLOAD_IN_PROGRESS')
        }

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
    } finally {
        if (lockAcquired.acquired && lockAcquired.lockValue) {
            try {
                await UploadLockService.releaseLock(fileUploadSession, partNumber, lockAcquired.lockValue)
            } catch (error) {
                console.error('Failed to release upload lock:', error)
            }
        }
    }
}
