import fp from 'fastify-plugin'
import { FastifyPluginAsync } from 'fastify'
import { ICacheService } from '@/core/ports/cache-service.interface.ts'
import { RedisCacheService } from '@/infrastructure/cache/redis-cache.service.ts'

declare module 'fastify' {
    interface FastifyInstance {
        cache: ICacheService
    }
}

const cachePlugin: FastifyPluginAsync = async (fastify) => {
    const redis = fastify.redis.getClient()
    const cacheService = new RedisCacheService(redis)

    fastify.decorate('cache', cacheService)
}

export default fp(cachePlugin, {
    name: 'cache',
    dependencies: ['config', 'redis'],
})