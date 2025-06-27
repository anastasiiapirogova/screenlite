import { getRedisClient } from '@/config/redis.ts'
import { FileUploadSession } from '@/generated/prisma/client.ts'
import { v4 as uuid } from 'uuid'

const redis = getRedisClient()

export interface LockResult {
    acquired: boolean
    lockValue?: string
}

export class UploadLockService {
    private static getLockKey(fileUploadSession: FileUploadSession, partNumber: number): string {
        return `upload_lock:${fileUploadSession.uploadId}:part_${partNumber}`
    }

    static async acquireLock(
        fileUploadSession: FileUploadSession, 
        partNumber: number, 
        timeoutMs: number = 30000
    ): Promise<LockResult> {
        const lockKey = this.getLockKey(fileUploadSession, partNumber)
        const lockValue = uuid()
        
        const result = await redis.set(lockKey, lockValue, 'PX', timeoutMs, 'NX')
        
        return result === 'OK' ? { acquired: true, lockValue } : { acquired: false }
    }

    static async releaseLock(
        fileUploadSession: FileUploadSession, 
        partNumber: number, 
        lockValue: string
    ): Promise<void> {
        const lockKey = this.getLockKey(fileUploadSession, partNumber)
        
        const luaScript = `
            if redis.call("get", KEYS[1]) == ARGV[1] then
                return redis.call("del", KEYS[1])
            else
                return 0
            end
        `
        
        await redis.eval(luaScript, 1, lockKey, lockValue)
    }

    static async isLocked(fileUploadSession: FileUploadSession, partNumber: number): Promise<boolean> {
        const lockKey = this.getLockKey(fileUploadSession, partNumber)
        const result = await redis.get(lockKey)

        return result !== null
    }

    static async getLockInfo(fileUploadSession: FileUploadSession, partNumber: number): Promise<{ exists: boolean, ttl?: number }> {
        const lockKey = this.getLockKey(fileUploadSession, partNumber)
        const exists = await redis.exists(lockKey)

        if (exists) {
            const ttl = await redis.pttl(lockKey)

            return { exists: true, ttl }
        }

        return { exists: false }
    }

    static async forceReleaseLock(fileUploadSession: FileUploadSession, partNumber: number): Promise<void> {
        const lockKey = this.getLockKey(fileUploadSession, partNumber)

        await redis.del(lockKey)
    }
} 