import { ICacheService } from '@/core/ports/cache-service.interface.ts'
import type { Redis } from 'ioredis'

export class RedisCacheService implements ICacheService {
    private readonly prefix = 'cache:'
    private readonly redis: Redis

    constructor(
        redis: Redis,
    ) {
        this.redis = redis
    }

    async exists(key: string): Promise<boolean> {
        return await this.redis.exists(this.getKey(key)) === 1
    }

    async get(key: string): Promise<string | null> {
        try {
            return await this.redis.get(this.getKey(key))
        } catch {
            return null
        }
    }

    async set(
        key: string, 
        value: string, 
        ttlSeconds?: number
    ): Promise<void> {
        if (ttlSeconds && ttlSeconds <= 0) {
            throw new Error('TTL must be positive')
        }

        const fullKey = this.getKey(key)

        if (ttlSeconds) {
            await this.redis.set(fullKey, value, 'EX', ttlSeconds)
        } else {
            await this.redis.set(fullKey, value)
        }
    }

    async delete(key: string): Promise<void> {
        await this.redis.del(this.getKey(key))
    }

    async clear(): Promise<void> {
        const keys = await this.scanKeys()

        if (keys.length === 0) return
      
        try {
            const pipeline = this.redis.pipeline()

            keys.forEach(key => pipeline.del(key))
            await pipeline.exec()
        } catch {
            throw new Error('Failed to clear cache')
        }
    }

    private getKey(key: string): string {
        return `${this.prefix}${key}`
    }

    private async scanKeys(): Promise<string[]> {
        const keys: string[] = []
        let cursor = '0'
    
        do {
            const [nextCursor, results] = await this.redis.scan(
                cursor,
                'MATCH',
                `${this.prefix}*`,
                'COUNT',
                100
            )

            keys.push(...results)
            cursor = nextCursor
        } while (cursor !== '0')

        return keys
    }
}