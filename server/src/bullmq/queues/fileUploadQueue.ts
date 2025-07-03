import { bullmqConnection } from '@/config/bullmq.ts'
import { FileUploadSession } from '@/generated/prisma/client.ts'
import { Queue } from 'bullmq'

export type FileUploadQueueJobData = {
    fileId: string
    fileUploadSession: FileUploadSession
}

export const fileUploadQueue = new Queue<FileUploadQueueJobData>('fileUploadQueue', {
    connection: bullmqConnection,
    defaultJobOptions: {
        removeOnComplete: true,
        removeOnFail: 1000
    }
})