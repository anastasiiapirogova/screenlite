import { bullmqConnection } from '@config/bullmq.js'
import { generateFilePreviewAndMetadataJob } from '@modules/file/jobs/generateFilePreviewAndMetadataJob.js'
import { handleFileUpdatedJob } from '@modules/file/jobs/handleFileUpdatedJob.js'
import { Worker } from 'bullmq'
import { fileQueue } from 'bullmq/queues/fileQueue.js'

export const fileQueueWorker = new Worker(
    fileQueue.name,
    async job => {
        if (job.name === 'generateFilePreviewAndMetadata') {
            await generateFilePreviewAndMetadataJob(job.data.fileId)
        }
        if (job.name === 'fileUpdated') {
            await handleFileUpdatedJob(job.data.fileId)
        }
    },
    {
        connection: bullmqConnection,
    }
)