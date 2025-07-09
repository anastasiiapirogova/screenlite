import { getRedisClient } from '@/config/redis.ts'
import type { Redis } from 'ioredis'
import { info } from '@/utils/logger.ts'

export class CacheService {
    static prefix = 'cache:'
    private static redis: Redis = getRedisClient()

    static debug = false

    static keys = {
        screenStatusCount: (workspaceId: string) => `screenStatusCount:${workspaceId}`,
        workspaceEntityCounts: (workspaceId: string) => `workspaceEntityCounts:${workspaceId}`,
    }

    private static withPrefix(key: string) {
        return `${this.prefix}${key}`
    }

    static async get<T>(key: string): Promise<T | null> {
        const value = await this.redis.get(this.withPrefix(key))
        const hit = !!value

        if (this.debug) {
            info(`[CacheService] ${hit ? 'HIT' : 'MISS'} for key: ${this.withPrefix(key)}`, {
                category: 'cache',
            })
        }

        return value ? JSON.parse(value) as T : null
    }

    static async set<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
        const stringValue = JSON.stringify(value)
        const cacheKey = this.withPrefix(key)

        if (ttlSeconds) {
            await this.redis.set(cacheKey, stringValue, 'EX', ttlSeconds)
        } else {
            await this.redis.set(cacheKey, stringValue)
        }
    }

    static async del(key: string): Promise<void> {
        await this.redis.del(this.withPrefix(key))
    }

    static async flushCache(): Promise<void> {
        const redis = this.redis
        let cursor = '0'

        do {
            const [nextCursor, keys] = await redis.scan(cursor, 'MATCH', `${this.prefix}*`, 'COUNT', 100)

            cursor = nextCursor
            if (keys.length) {
                await redis.del(...keys)
            }
        } while (cursor !== '0')
    }
}