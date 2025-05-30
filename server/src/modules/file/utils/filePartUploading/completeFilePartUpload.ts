import { FileUploadSession } from 'generated/prisma/client.js'
import { Request, Response } from 'express'
import { Buckets, s3Client } from '../../../../config/s3Client.js'
import { UploadPartCommand } from '@aws-sdk/client-s3'
import { getRedisClient } from '../../../../config/redis.js'
import { updateFileUploadSession } from './updateFileUploadSession.js'
import { ResponseHandler } from '@utils/ResponseHandler.js'
import { addFileUploadCompleteJob } from '../addFileUploadCompleteJob.js'

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
    const params = {
        Bucket: Buckets.uploads,
        Key: fileUploadSession.path,
        PartNumber: fileUploadSession.parts + 1,
        UploadId: fileUploadSession.uploadId,
        Body: data,
    }

    return await s3Client.send(new UploadPartCommand(params))
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
        const part = await uploadPartToS3(fileUploadSession, data)

        if (!part.ETag) {
            return ResponseHandler.serverError(res, 'Error during file part upload')
        }

        await storePartETagInRedis(fileUploadSession, part.ETag)

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