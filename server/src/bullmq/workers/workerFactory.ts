import { info, error } from '@/utils/logger.ts'
import { Job } from 'bullmq'

interface WorkerProcessorOptions<T> {
    handlers: Record<string, (job: Job<T>) => Promise<void>>
    category: string
    getLogContext: (job: Job<T>) => string
}

export function createWorkerProcessor<T>({ handlers, category, getLogContext }: WorkerProcessorOptions<T>) {
    return async (job: Job<T>) => {
        const logContext = getLogContext(job)
        const start = Date.now()

        info(`Started job: ${job.name}, ${logContext}`, { category })
        try {
            const handler = handlers[job.name]

            if (handler) {
                await handler(job)
            } else {
                throw new Error(`No handler for job name: ${job.name}`)
            }
            const duration = Date.now() - start

            info(`Completed job: ${job.name}, ${logContext}, duration: ${duration}ms`, { category })
        } catch (err) {
            const duration = Date.now() - start

            error(`Error processing job: ${job.name}, ${logContext}, duration: ${duration}ms`, err, { category })
            throw err
        }
    }
} 