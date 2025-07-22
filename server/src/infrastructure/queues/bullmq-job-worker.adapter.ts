import { ConnectionOptions, Worker } from 'bullmq'
import { IJobWorker } from '@/core/ports/job-queue.interface.ts'
import { AppJobRegistry } from '@/core/ports/job-registry.interface.ts'

export class BullMQJobWorkerAdapter implements IJobWorker<AppJobRegistry> {
    private readonly workers = new Map<keyof AppJobRegistry, Worker>()

    constructor(private readonly connection: ConnectionOptions) {}

    register<J extends keyof AppJobRegistry>(
        jobType: J,
        handler: (data: AppJobRegistry[J]['data']) => Promise<void>
    ): void {
        if (this.workers.has(jobType)) {
            throw new Error(`Worker already registered for: ${String(jobType)}`)
        }

        const worker = new Worker(
            jobType as string,
            async job => await handler(job.data),
            {
                connection: this.connection
            }
        )

        worker.on('error', (error) => {
            console.error(`Worker error for ${String(jobType)}:`, error)
        })

        this.workers.set(jobType, worker)
    }

    async shutdown(): Promise<void> {
        await Promise.all(
            [...this.workers.values()].map(worker => worker.close())
        )
        this.workers.clear()
    }
}