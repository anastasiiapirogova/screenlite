import { Request, Response } from 'express'
import { z } from 'zod'
import { prisma } from '../../../config/prisma.js'
import { getRedisClient } from '../../../config/redis.js'
import { Buckets, s3Client } from '../../../config/s3Client.js'
import { AbortMultipartUploadCommand } from '@aws-sdk/client-s3'
import { ResponseHandler } from '@utils/ResponseHandler.js'
import { filePolicy } from '../policies/filePolicy.js'
import { FileUploadingRepository } from '../repositories/FileUploadingRepository.js'

const filePartUploadSchema = z.object({
    'fileUploadSessionId': z.string().nonempty('FILE_UPLOAD_SESSION_ID_IS_REQUIRED'),
})

const validateRequest = async (req: Request, res: Response) => {
    const validation = await filePartUploadSchema.safeParseAsync(req.body)

    if (!validation.success) {
        ResponseHandler.zodError(req, res, validation.error.errors)
        return null
    }

    return validation.data['fileUploadSessionId']
}

export const cancelFileUploading = async (req: Request, res: Response) => {
    const user = req.user!

    const sessionId = await validateRequest(req, res)

    if (!sessionId) return

    const fileUploadSession = await FileUploadingRepository.getFileUploadSession(sessionId)

    if (!fileUploadSession) {
        return ResponseHandler.notFound(res)
    }

    const allowed = await filePolicy.canUploadFilePart(user, fileUploadSession.userId, fileUploadSession.workspaceId)

    if (!allowed) {
        return ResponseHandler.forbidden(res)
    }

    await prisma.fileUploadSession.delete({
        where: {
            id: sessionId,
        },
    })

    const redis = getRedisClient()

    await redis.del(`fileUploadSession:${fileUploadSession.id}`)

    await s3Client.send(new AbortMultipartUploadCommand({
        Bucket: Buckets.uploads,
        Key: fileUploadSession.path,
        UploadId: fileUploadSession.uploadId,
    }))

    return ResponseHandler.empty(res)
}