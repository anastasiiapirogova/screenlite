export type SimpleRedisLock = {
    key: string
    token: string
}

export interface ILockService {
    acquire(key: string, ttl: number): Promise<SimpleRedisLock | null>

    release(lock: SimpleRedisLock): Promise<void>
}