import { FileUploadSession } from '@generated/prisma/client.js'
import { Request, Response } from 'express'
import { getRedisClient } from '@config/redis.js'
import { updateFileUploadSession } from './updateFileUploadSession.js'
import { ResponseHandler } from '@utils/ResponseHandler.js'
import { addFileUploadCompleteJob } from '../addFileUploadCompleteJob.js'
import { StorageService } from '@services/storage/StorageService.js'

const validateFilePart = (req: Request, res: Response, fileUploadSession: FileUploadSession, data: Buffer): boolean => {
    if (data.length === 0) {
        ResponseHandler.validationError(req, res, {
            filePart: 'FILE_PART_IS_REQUIRED',
        })
        return false
    }

    const remainingBytes = fileUploadSession.size - fileUploadSession.uploaded

    if (data.length < 5 * 1024 * 1024 && remainingBytes > data.length) {
        ResponseHandler.validationError(req, res, {
            filePart: 'FILE_PART_SIZE_TOO_SMALL',
        })
        return false
    }

    return true
}

const uploadPartToS3 = async (fileUploadSession: FileUploadSession, data: Buffer) => {
    return await StorageService.getInstance().uploadPart(
        fileUploadSession.path,
        fileUploadSession.uploadId,
        fileUploadSession.parts + 1,
        data
    )
}

const storePartETagInRedis = async (fileUploadSession: FileUploadSession, etag: string) => {
    const redis = getRedisClient()

    await redis.hset(`fileUploadSession:${fileUploadSession.id}`, `part:${fileUploadSession.parts + 1}`, etag)
    await redis.expire(`fileUploadSession:${fileUploadSession.id}`, 3 * 24 * 60 * 60)
}

const revertUpdates = async (fileUploadSession: FileUploadSession) => {
    const redis = getRedisClient()

    await redis.hdel(`fileUploadSession:${fileUploadSession.id}`, `part:${fileUploadSession.parts + 1}`)
}

export const completeFilePartUpload = async (req: Request, res: Response, fileUploadSession: FileUploadSession, data: Buffer) => {
    if (!validateFilePart(req, res, fileUploadSession, data)) {
        return
    }

    try {
        const etag = await uploadPartToS3(fileUploadSession, data)

        await storePartETagInRedis(fileUploadSession, etag)

        let updatedSession: FileUploadSession | null = null

        if (fileUploadSession.uploaded + BigInt(data.length) >= fileUploadSession.size) {
            addFileUploadCompleteJob(fileUploadSession.id)
        }

        updatedSession = await updateFileUploadSession(fileUploadSession, data.length)

        return ResponseHandler.created(res, {
            fileUploadSession: updatedSession || fileUploadSession,
        })
    } catch (error) {
        console.error('Error during file part upload:', error)

        await revertUpdates(fileUploadSession)

        return ResponseHandler.serverError(res, 'Error during file part upload')
    }
}