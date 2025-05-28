import { bullmqConnection } from '@config/bullmq.js'
import { Queue } from 'bullmq'

export const fileUploadQueue = new Queue('fileUploadQueue', {
    connection: bullmqConnection,
    defaultJobOptions: {
        removeOnComplete: true,
        removeOnFail: 1000
    }
})

await fileUploadQueue.upsertJobScheduler(
    'tmp-folder-cleanup',
    { pattern: '0 0 0 * * *' },
    {
        name: 'cleanupTmpFolder',
        opts: {
            backoff: 3,
            attempts: 5,
            removeOnFail: 1000,
        },
    },
)