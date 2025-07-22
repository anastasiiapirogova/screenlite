import fp from 'fastify-plugin'
import { FastifyPluginAsync } from 'fastify'
import { AppJobRegistry } from '@/core/ports/job-registry.interface.ts'
import { IJobProducer } from '@/core/ports/job-queue.interface.ts'
import { BullMQJobProducerAdapter } from '@/infrastructure/queues/bullmq-job-producer.adapter.ts'

declare module 'fastify' {
    interface FastifyInstance {
        jobProducer: IJobProducer<AppJobRegistry>
    }
}

const jobQueuePlugin: FastifyPluginAsync = async (fastify) => {
    const redis = fastify.redis.getClient('bullmq')

    const jobProducer = new BullMQJobProducerAdapter(redis)

    fastify.decorate('jobProducer', jobProducer)

    fastify.addHook('onClose', async () => {
        await jobProducer.shutdown()
    })
}

export default fp(jobQueuePlugin, {
    name: 'job-queue',
    dependencies: ['redis'],
})