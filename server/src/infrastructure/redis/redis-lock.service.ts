import { Redis } from 'ioredis'
import { randomUUID } from 'crypto'
import { ILockService, SimpleRedisLock } from '@/core/ports/lock-service.interface.ts'

export class RedisLockService implements ILockService {
    constructor(private readonly redis: Redis) {}

    async acquire(key: string, ttl: number): Promise<SimpleRedisLock | null> {
        const token = randomUUID()

        const success = await this.redis.call('SET', key, token, 'PX', ttl.toString(), 'NX')

        if (success !== 'OK') {
            return null
        }

        return { key, token }
    }

    async release(lock: SimpleRedisLock): Promise<void> {
        const lua = `
            if redis.call("get", KEYS[1]) == ARGV[1] then
            return redis.call("del", KEYS[1])
            else
            return 0
            end
        `

        try {
            await this.redis.eval(lua, 1, lock.key, lock.token)
        } catch (err) {
            console.error('Failed to release Redis lock:', err)
        }
    }
}
