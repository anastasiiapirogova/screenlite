import { getRedisClient } from '@/config/redis.ts'
import { Socket } from 'socket.io'

const redis = getRedisClient()

const DEVICE_HASH_KEY = 'device:connections'

export const getDeviceSocketConnectionInfoByToken = async (token: string) => {
    const socketId = await redis.hget(DEVICE_HASH_KEY, token)

    return socketId
}

export const removeDeviceSocketConnectionInfoByToken = async (token: string) => {
    const socketId = await redis.hget(DEVICE_HASH_KEY, token)

    if (socketId) {
        await redis.hdel(DEVICE_HASH_KEY, token)
        return true
    }
    return false
}

export const storeDeviceSocketConnectionInfo = async (token: string, socket: Socket) => {
    await redis.hset(DEVICE_HASH_KEY, token, socket.id)
}

export const removeDeviceSocketConnectionInfoBySocketId = async (socketId: string) => {
    const tokens = await redis.hkeys(DEVICE_HASH_KEY)

    for (const token of tokens) {
        const storedSocketId = await redis.hget(DEVICE_HASH_KEY, token)

        if (storedSocketId === socketId) {
            await redis.hdel(DEVICE_HASH_KEY, token)
            return token
        }
    }
    return null
}