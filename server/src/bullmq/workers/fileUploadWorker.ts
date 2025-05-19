import { bullmqConnection } from '@config/bullmq.js'
import { mergeFilePartsJob } from '@modules/file/jobs/mergeFilePartsJob.js'
import { Worker } from 'bullmq'
import { fileUploadQueue } from 'bullmq/queues/fileUploadQueue.js'

export const fileUploadWorker = new Worker(
    fileUploadQueue.name,
    async job => {
        if (job.name === 'mergeFileParts') {
            await mergeFilePartsJob(job.data.fileUploadSessionId)
        }
    },
    {
        connection: bullmqConnection,
    }
)