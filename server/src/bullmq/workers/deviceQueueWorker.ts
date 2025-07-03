import { bullmqConnection } from '@/config/bullmq.ts'
import { sendNewStateToDeviceJob } from '@/modules/device/jobs/sendNewStateToDeviceJob.ts'
import { Job, Worker } from 'bullmq'
import { deviceQueue, DeviceQueueJobData } from '@/bullmq/queues/deviceQueue.ts'
import { createWorkerProcessor } from './workerFactory.ts'

const handlers: Record<string, (job: Job<DeviceQueueJobData>) => Promise<void>> = {
    sendNewStateToDevice: async (job) => {
        await sendNewStateToDeviceJob(job.data.token)
    }
}

const processor = createWorkerProcessor<DeviceQueueJobData>({
    handlers,
    category: 'deviceQueueWorker',
    getLogContext: (job) => `token: ${job.data.token}`
})

export const deviceQueueWorker = new Worker(
    deviceQueue.name,
    processor,
    {
        connection: bullmqConnection,
    }
)