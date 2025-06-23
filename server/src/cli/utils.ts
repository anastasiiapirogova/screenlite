import { getRedisClient } from '@/config/redis.js'

export async function getAllQueueNames(prefix = 'bull') {
    const redis = getRedisClient()
    
    const keys = await redis.keys(`${prefix}:*:id`)

    const queueNames = keys.map((key) => key.split(':')[1])

    return [...new Set(queueNames)]
}
