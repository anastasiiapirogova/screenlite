import { bullmqConnection } from '@config/bullmq.js'
import { Queue } from 'bullmq'

export async function listJobs(queueName: string, status: string, start = 0, end = 10) {
    const queue = new Queue(queueName, { connection: bullmqConnection })

    try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const jobs = await queue.getJobs([status as any], start, end)

        return jobs.map(job => ({
            id: job.id,
            name: job.name,
            data: job.data,
            status,
            failedReason: job.failedReason,
            finishedOn: job.finishedOn,
            attemptsMade: job.attemptsMade,
        }))
    } catch (error) {
        console.error(`Error listing jobs for queue ${queueName}:`, error)
        throw error
    }
}
