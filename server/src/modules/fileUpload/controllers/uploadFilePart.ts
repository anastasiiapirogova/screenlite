import { ResponseHandler } from '@/utils/ResponseHandler.ts'
import { Request, Response } from 'express'
import { MultipartFileUploader } from '@/config/storage.ts'
import { FileUploadSessionValidator } from '../utils/FileUploadSessionValidator.ts'
import { ContentLengthValidator } from '../utils/ContentLengthValidator.ts'
import { addCompleteMultipartUploadJob } from '../utils/addCompleteMultipartUploadJob.ts'
import { Readable } from 'stream'
import { UploadLockService } from '../services/UploadLockService.ts'
import { FileUploadRepository } from '../repositories/FileUploadRepository.ts'

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

        const updatedSession = await FileUploadRepository.updateSession(
            fileUploadSession,
            contentLength
        )

        if(updatedSession.completedAt) {
            addCompleteMultipartUploadJob(updatedSession)
        }

        ResponseHandler.json(res, {
            fileUploadSession: updatedSession
        })
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
