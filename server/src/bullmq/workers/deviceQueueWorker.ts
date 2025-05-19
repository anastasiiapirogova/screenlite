import { bullmqConnection } from '@config/bullmq.js'
import { sendNewStateToDeviceJob } from '@modules/device/jobs/sendNewStateToDeviceJob.js'
import { Worker } from 'bullmq'
import { deviceQueue } from 'bullmq/queues/deviceQueue.js'

export const deviceQueueWorker = new Worker(
    deviceQueue.name,
    async job => {
        if (job.name === 'sendNewStateToDevice') {
            await sendNewStateToDeviceJob(job.data.token)
        }
    },
    {
        connection: bullmqConnection,
    },
)