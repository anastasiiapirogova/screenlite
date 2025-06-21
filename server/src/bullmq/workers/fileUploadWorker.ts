import { bullmqConnection } from '@config/bullmq.js'
import { completeMultipartUploadJob } from '@modules/workspace/modules/fileUpload/jobs/completeMultipartUploadJob.js'
import { Worker } from 'bullmq'
import { fileUploadQueue } from 'bullmq/queues/fileUploadQueue.js'

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