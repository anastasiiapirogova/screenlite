import { getRedisClient } from '@/config/redis.js'
import { Redis } from 'ioredis'
import { toSeconds } from './toSeconds.js'

const DEFAULT_PREFIX = 'rate_limit:'

const DEFAULT_WINDOW = {
    value: 1,
    unit: 'minutes' as const,
}

export type RateLimiterOptions = {
	redis?: Redis
	limit: number
	window?: {
		value: number
		unit: 'seconds' | 'minutes' | 'hours'
	}
	prefix?: string
}

export type RateLimitResponse = {
	allowed: boolean
	limit: number
	remaining: number
	resetIn: number
}

export class RateLimiter {
    private redis: Redis
    private limit: number
    private windowInSeconds: number
    private prefix: string

    constructor(options: RateLimiterOptions) {
        this.redis = options.redis ?? getRedisClient()
        this.limit = options.limit
        this.prefix = options.prefix ?? DEFAULT_PREFIX

        const window = options.window ?? DEFAULT_WINDOW

        this.windowInSeconds = toSeconds(window.value, window.unit) || 60
    }

    async canProceed(key: string): Promise<RateLimitResponse> {
        const redisKey = `${this.prefix}:${key}`

        const current = await this.redis.incr(redisKey)

        if (current === 1) {
            await this.redis.expire(redisKey, this.windowInSeconds)
        }

        const ttl = await this.redis.ttl(redisKey)
        const remaining = Math.max(this.limit - current, 0)

        return {
            allowed: current <= this.limit,
            limit: this.limit,
            remaining,
            resetIn: ttl > 0 ? ttl : this.windowInSeconds,
        }
    }

    async reset(key: string): Promise<void> {
        const redisKey = `${this.prefix}:${key}`

        await this.redis.del(redisKey)
    }
}
