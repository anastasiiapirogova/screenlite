import { fileUploadQueue } from '@/bullmq/queues/fileUploadQueue.js'
import { FileUploadSession } from '@/generated/prisma/client.js'

export const addCompleteMultipartUploadJob = async (fileUploadSession: FileUploadSession, fileId: string) => {
    await fileUploadQueue.add(
        'completeMultipartUpload',
        {
            fileUploadSession,
            fileId
        },
        {
            jobId: `completeMultipartUpload:${fileUploadSession.id}`,
            removeOnComplete: true,
            removeOnFail: false,
        }
    )
}