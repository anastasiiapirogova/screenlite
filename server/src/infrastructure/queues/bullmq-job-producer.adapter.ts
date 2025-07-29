import { ConnectionOptions, Queue } from 'bullmq'
import { IJobProducer } from '@/core/ports/job-queue.interface.ts'
import { AppJobRegistry } from '@/core/ports/job-registry.interface.ts'

export class BullMQJobProducerAdapter implements IJobProducer<AppJobRegistry> {
    private readonly queues = new Map<keyof AppJobRegistry, Queue>()

    constructor(private readonly connection: ConnectionOptions) {}

    async enqueue<J extends keyof AppJobRegistry>(
        jobType: J,
        payload: AppJobRegistry[J]['data'],
    ): Promise<string> {
        const queue = this.getOrCreateQueue(jobType)
        const job = await queue.add(jobType as string, payload)
        
        if (!job.id) {
            throw new Error(`BullMQ failed to generate job ID for ${String(jobType)}`)
        }

        return job.id
    }

    async enqueueMany<J extends keyof AppJobRegistry>(
        jobType: J,
        payload: AppJobRegistry[J]['data'][]
    ): Promise<string[]> {
        const queue = this.getOrCreateQueue(jobType)
        const jobs = await queue.addBulk(payload.map(item => ({ name: jobType as string, data: item })))

        return jobs.map(job => job.id!)
    }

    private getOrCreateQueue(jobType: keyof AppJobRegistry): Queue {
        if (this.queues.has(jobType)) return this.queues.get(jobType)!
        
        const queue = new Queue(jobType as string, { connection: this.connection })

        this.queues.set(jobType, queue)
        return queue
    }

    async shutdown(): Promise<void> {
        await Promise.all(
            [...this.queues.values()].map(queue => 
                queue.close().catch(e => console.error('Error closing queue:', e))
            )
        )
        this.queues.clear()
    }
}