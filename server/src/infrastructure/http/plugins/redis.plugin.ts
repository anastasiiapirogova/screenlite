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

    const clients = {
        default: new Redis(baseConfig),
        bullmq: new Redis({
            ...baseConfig,
            maxRetriesPerRequest: null
        }),
        pub: new Redis({
            ...baseConfig,
            enableOfflineQueue: false,
        }),
        sub: new Redis({
            ...baseConfig,
            enableOfflineQueue: false,
            autoResubscribe: true
        }),
        cache: new Redis({
            ...baseConfig,
            enableOfflineQueue: true,
            commandTimeout: 100
        })
    }

    Object.entries(clients).forEach(([name, client]) => {
        service.registerClient(name, client)
    })

    fastify.decorate('redis', service)
  
    fastify.addHook('onClose', async () => {
        await service.destroy()
    })
}

export default fp(redisPlugin, {
    name: 'redis',
    dependencies: ['config']
})