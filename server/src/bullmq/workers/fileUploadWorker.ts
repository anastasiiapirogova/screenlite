import { bullmqConnection } from '@/config/bullmq.ts'
import { completeMultipartUploadJob } from '@/modules/workspace/modules/fileUpload/jobs/completeMultipartUploadJob.ts'
import { Job, Worker } from 'bullmq'
import { fileUploadQueue } from '@/bullmq/queues/fileUploadQueue.ts'
import { info, error } from '@/utils/logger.ts'

const processor = async (job: Job) => {
    const fileId = job.data.fileId

    info(`Started job: ${job.name}, fileId: ${fileId}`, { category: 'fileUploadWorker' })
    try {
        if (job.name === 'completeMultipartUpload') {
            await completeMultipartUploadJob(job.data.fileUploadSession, fileId)
        }
        info(`Completed job: ${job.name}, fileId: ${fileId}`, { category: 'fileUploadWorker' })
    } catch (err) {
        error(`Error processing job: ${job.name}, fileId: ${fileId}`, err, { category: 'fileUploadWorker' })
        throw err
    }
}

export const fileUploadWorker = new Worker(
    fileUploadQueue.name,
    processor,
    {
        connection: bullmqConnection,
    }
)