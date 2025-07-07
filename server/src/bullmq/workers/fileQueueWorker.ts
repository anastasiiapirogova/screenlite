import { bullmqConnection } from '@/config/bullmq.ts'
import { generateFilePreviewAndMetadataJob } from '@/modules/file/jobs/generateFilePreviewAndMetadataJob.ts'
import { handleFileUpdatedJob } from '@/modules/file/jobs/handleFileUpdatedJob.ts'
import { handleFileForceDeletedJob } from '@/modules/file/jobs/handleFileForceDeletedJob.ts'
import { Job, Worker } from 'bullmq'
import { fileQueue, FileQueueJobData } from '@/bullmq/queues/fileQueue.ts'
import { createWorkerProcessor } from './workerFactory.ts'

const handlers: Record<string, (job: Job<FileQueueJobData>) => Promise<void>> = {
    generateFilePreviewAndMetadata: async (job) => {
        await generateFilePreviewAndMetadataJob(job.data.fileId, job.attemptsMade + 1)
    },
    fileUpdated: async (job) => {
        await handleFileUpdatedJob(job.data.fileId)
    },
    fileForceDeleted: async (job) => {
        await handleFileForceDeletedJob(job.data.fileId)
    }
}

const processor = createWorkerProcessor<FileQueueJobData>({
    handlers,
    category: 'fileQueueWorker',
    getLogContext: (job) => `fileId: ${job.data.fileId}`
})

export const fileQueueWorker = new Worker(
    fileQueue.name,
    processor,
    {
        connection: bullmqConnection,
    }
)