import { Redis } from 'ioredis'

let redisClient: Redis | null = null

export const getRedisClient = (): Redis => {
    if (!redisClient) {
        redisClient = new Redis({
            host: process.env.REDIS_HOST || '127.0.0.1',
            port: Number(process.env.REDIS_PORT) || 6379,
        })
    }
    return redisClient
}

export const redisKeys = {
    screenStatusCount: (workspaceId: string) => `screenStatusCount:${workspaceId}`,
}