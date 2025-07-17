import { Queue, Worker } from 'bullmq'
import { Redis } from 'ioredis'

export class QueueService {
    private static instance: QueueService
    private queues: Map<string, Queue> = new Map()
    private workers: Map<string, Worker> = new Map()

    private constructor(private redis: Redis) {}

    public static getInstance(redis: Redis): QueueService {
        if (!QueueService.instance) {
            QueueService.instance = new QueueService(redis)
        }
        return QueueService.instance
    }

    getQueue<T>(name: string): Queue<T> {
        if (!this.queues.has(name)) {
            this.queues.set(name, new Queue<T>(name, { connection: this.redis }))
        }
        return this.queues.get(name) as Queue<T>
    }

    createWorker<T>(name: string, handler: (job: { data: T }) => Promise<void>): Worker {
        const worker = new Worker<T>(name, handler, { connection: this.redis })

        this.workers.set(name, worker)
        return worker
    }

    async shutdown() {
        await Promise.all([
            ...Array.from(this.queues.values()).map(q => q.close()),
            ...Array.from(this.workers.values()).map(w => w.close()),
        ])
        await this.redis.quit()
    }
}