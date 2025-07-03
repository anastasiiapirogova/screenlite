import { bullmqConnection } from '@/config/bullmq.ts'
import { sendNewStateToDeviceJob } from '@/modules/device/jobs/sendNewStateToDeviceJob.ts'
import { Job, Worker } from 'bullmq'
import { deviceQueue } from '@/bullmq/queues/deviceQueue.ts'
import { info, error } from '@/utils/logger.ts'

const processor = async (job: Job) => {
    const token = job.data.token

    info(`Started job: ${job.name}, token: ${token}`, { category: 'deviceQueueWorker' })
    try {
        if (job.name === 'sendNewStateToDevice') {
            await sendNewStateToDeviceJob(token)
        }
        info(`Completed job: ${job.name}, token: ${token}`, { category: 'deviceQueueWorker' })
    } catch (err) {
        error(`Error processing job: ${job.name}, token: ${token}`, err, { category: 'deviceQueueWorker' })
        throw err
    }
}

export const deviceQueueWorker = new Worker(
    deviceQueue.name,
    processor,
    {
        connection: bullmqConnection,
    }
)