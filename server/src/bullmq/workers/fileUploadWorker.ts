import { bullmqConnection } from '@/config/bullmq.ts'
import { Job, Worker } from 'bullmq'
import { fileUploadQueue, FileUploadQueueJobData } from '@/bullmq/queues/fileUploadQueue.ts'
import { createWorkerProcessor } from './workerFactory.ts'
import { completeMultipartUploadJob } from '@/modules/fileUpload/jobs/completeMultipartUploadJob.ts'

const handlers: Record<string, (job: Job<FileUploadQueueJobData>) => Promise<void>> = {
    completeMultipartUpload: async (job) => {
        await completeMultipartUploadJob(job.data.fileUploadSession, job.data.fileId)
    }
}

const processor = createWorkerProcessor<FileUploadQueueJobData>({
    handlers,
    category: 'fileUploadWorker',
    getLogContext: (job) => `fileId: ${job.data.fileId}`
})

export const fileUploadWorker = new Worker(
    fileUploadQueue.name,
    processor,
    {
        connection: bullmqConnection,
    }
)