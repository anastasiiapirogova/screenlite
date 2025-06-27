import { bullmqConnection } from '@/config/bullmq.ts'
import { sendNewStateToDeviceJob } from '@/modules/device/jobs/sendNewStateToDeviceJob.ts'
import { Worker } from 'bullmq'
import { deviceQueue } from '@/bullmq/queues/deviceQueue.ts'

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