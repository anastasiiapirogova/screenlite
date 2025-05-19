import { prisma } from '@config/prisma.js'
import { CompleteMultipartUploadCommand } from '@aws-sdk/client-s3'
import { getRedisClient } from '@config/redis.js'
import { Buckets, s3Client } from '@config/s3Client.js'

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
        await s3Client.send(new CompleteMultipartUploadCommand({
            Bucket: Buckets.uploads,
            Key: fileUploadSession.path,
            UploadId: fileUploadSession.uploadId,
            MultipartUpload: {
                Parts: formattedParts
            }
        }))
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