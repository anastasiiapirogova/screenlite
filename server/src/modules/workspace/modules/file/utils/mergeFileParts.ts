import { prisma } from '@config/prisma.js'
import { getRedisClient } from '@config/redis.js'
import { StorageService } from '@services/StorageService.js'

export const mergeFileParts = async (fileUploadSessionId: string) => {
    const fileUploadSession = await prisma.fileUploadSession.findUnique({
        where: {
            id: fileUploadSessionId
        }
    })

    if (!fileUploadSession) {
        return
    }

    const redis = getRedisClient()
    const parts = await redis.hgetall(`fileUploadSession:${fileUploadSession.id}`)

    const formattedParts = Object.entries(parts).map(([key, etag]) => ({
        PartNumber: parseInt(key.split(':')[1]),
        ETag: etag.replace(/"/g, ''),
    }))

    try {
        await StorageService.completeMultipartUpload(
            fileUploadSession.path,
            fileUploadSession.uploadId,
            formattedParts
        )
    } catch (error) {
        if ((error as Error).name === 'NoSuchUpload') {
            if (fileUploadSession.uploaded === fileUploadSession.size) {
                return fileUploadSession
            } else {
                return
            }
        } else {
            throw error
        }
    }

    return fileUploadSession
}