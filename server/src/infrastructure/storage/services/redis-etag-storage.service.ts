import { IEtagStorage } from '@/core/ports/etag-storage.interface.ts'
import { Redis } from 'ioredis'

export class RedisEtagStorage implements IEtagStorage {
    constructor(private redis: Redis, private prefix: string = 'multipart') {}
  
    private key(uploadId: string): string {
        return `${this.prefix}:${uploadId}:etags`
    }

    async initializeUpload(uploadId: string): Promise<void> {
        await this.redis.expire(this.key(uploadId), 60 * 60 * 24 * 3)
    }

    async storeEtag(uploadId: string, partNumber: number, etag: string): Promise<void> {
        await this.redis.hset(this.key(uploadId), partNumber.toString(), etag)
    }

    async getEtags(uploadId: string): Promise<Map<number, string>> {
        const data = await this.redis.hgetall(this.key(uploadId))
        const map = new Map<number, string>()
    
        for (const [part, etag] of Object.entries(data)) {
            map.set(parseInt(part), etag)
        }
    
        return map
    }

    async cleanup(uploadId: string): Promise<void> {
        await this.redis.del(this.key(uploadId))
    }
}