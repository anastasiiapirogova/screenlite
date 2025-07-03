import { bullmqConnection } from '@/config/bullmq.ts'
import { generateFilePreviewAndMetadataJob } from '@/modules/workspace/modules/file/jobs/generateFilePreviewAndMetadataJob.ts'
import { handleFileUpdatedJob } from '@/modules/workspace/modules/file/jobs/handleFileUpdatedJob.ts'
import { handleFileForceDeletedJob } from '@/modules/workspace/modules/file/jobs/handleFileForceDeletedJob.ts'
import { Job, Worker } from 'bullmq'
import { fileQueue } from '@/bullmq/queues/fileQueue.ts'
import { info, error } from '@/utils/logger.ts'

const processor = async (job: Job) => {
    const fileId = job.data.fileId

    info(`Started job: ${job.name}, fileId: ${fileId}`, { category: 'fileQueueWorker' })
    try {
        if (job.name === 'generateFilePreviewAndMetadata') {
            await generateFilePreviewAndMetadataJob(fileId, job.attemptsMade + 1)
        }
        if (job.name === 'fileUpdated' || job.name === 'fileSoftDeleted') {
            await handleFileUpdatedJob(fileId)
        }
        if (job.name === 'fileForceDeleted') {
            await handleFileForceDeletedJob(fileId)
        }
        info(`Completed job: ${job.name}, fileId: ${fileId}`, { category: 'fileQueueWorker' })
    } catch (err) {
        error(`Error processing job: ${job.name}, fileId: ${fileId}`, err, { category: 'fileQueueWorker' })
        throw err
    }
}

export const fileQueueWorker = new Worker(
    fileQueue.name,
    processor,
    {
        connection: bullmqConnection,
    }
)