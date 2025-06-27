import { bullmqConnection } from '@/config/bullmq.ts'
import { completeMultipartUploadJob } from '@/modules/workspace/modules/fileUpload/jobs/completeMultipartUploadJob.ts'
import { Worker } from 'bullmq'
import { fileUploadQueue } from '@/bullmq/queues/fileUploadQueue.ts'

export const fileUploadWorker = new Worker(
    fileUploadQueue.name,
    async job => {
        if (job.name === 'completeMultipartUpload') {
            await completeMultipartUploadJob(job.data.fileUploadSession, job.data.fileId)
        }
    },
    {
        connection: bullmqConnection,
    }
)