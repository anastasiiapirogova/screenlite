import fp from 'fastify-plugin'
import { Redis, RedisOptions } from 'ioredis'
import { RedisService } from '@/infrastructure/redis/redis.service.ts'
import type { FastifyPluginAsync } from 'fastify'

declare module 'fastify' {
    interface FastifyInstance {
        redis: RedisService
    }
}

const redisPlugin: FastifyPluginAsync = async (fastify) => {
    const config = fastify.config.redis

    const service = new RedisService()

    const baseConfig: RedisOptions = {
        host: config.host,
        port: config.port,
        username: config.username,
        password: config.password,
        db: config.db,
    }

    service.registerClient('default', new Redis(baseConfig))
  
    service.registerClient('bullmq', new Redis({
        ...baseConfig,
        maxRetriesPerRequest: null
    }))
  
    service.registerClient('pubsub', new Redis({
        ...baseConfig,
        enableOfflineQueue: false,
        autoResubscribe: false
    }))

    service.registerClient('cache', new Redis({
        ...baseConfig,
        enableOfflineQueue: true,
        commandTimeout: 100
    }))

    fastify.decorate('redis', service)
  
    fastify.addHook('onClose', async () => {
        await service.destroy()
    })
}

export default fp(redisPlugin, {
    name: 'redis',
    dependencies: ['config']
})