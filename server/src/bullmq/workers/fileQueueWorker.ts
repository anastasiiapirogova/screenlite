import { bullmqConnection } from '@/config/bullmq.ts'
import { generateFilePreviewAndMetadataJob } from '@/modules/workspace/modules/file/jobs/generateFilePreviewAndMetadataJob.ts'
import { handleFileUpdatedJob } from '@/modules/workspace/modules/file/jobs/handleFileUpdatedJob.ts'
import { Worker } from 'bullmq'
import { fileQueue } from '@/bullmq/queues/fileQueue.ts'

export const fileQueueWorker = new Worker(
    fileQueue.name,
    async job => {
        if (job.name === 'generateFilePreviewAndMetadata') {
            await generateFilePreviewAndMetadataJob(job.data.fileId, job.attemptsMade + 1)
        }
        if (job.name === 'fileUpdated') {
            await handleFileUpdatedJob(job.data.fileId)
        }
        
    },
    {
        connection: bullmqConnection,
    }
)