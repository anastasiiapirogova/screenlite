import { IMessageBroker } from '@/core/ports/messaging.interface.ts'
import { Redis } from 'ioredis'
import { Mutex } from 'async-mutex'

export class RedisMessageBrokerAdapter implements IMessageBroker {
    private handlers = new Map<string, Set<(message: string) => void>>()
    private channelMutexes = new Map<string, Mutex>()

    constructor(private redisPub: Redis, private redisSub: Redis) {
        this.redisSub.on('message', (channel, message) => {
            const callbacks = this.handlers.get(channel)

            if (!callbacks) return

            const callbacksSnapshot = new Set(callbacks)

            for (const cb of callbacksSnapshot) {
                try {
                    cb(message)
                } catch (err) {
                    console.error('Error in message handler', err)
                }
            }
        })
    }

    private getMutex(channel: string): Mutex {
        let mutex = this.channelMutexes.get(channel)

        if (!mutex) {
            mutex = new Mutex()
            this.channelMutexes.set(channel, mutex)
        }
        return mutex
    }

    async publish(channel: string, message: string): Promise<void> {
        await this.redisPub.publish(channel, message)
    }

    async subscribe(channel: string, callback: (message: string) => void): Promise<void> {
        const mutex = this.getMutex(channel)
        const release = await mutex.acquire()

        try {
            if (!this.handlers.has(channel)) {
                this.handlers.set(channel, new Set())
                await this.redisSub.subscribe(channel)
            }
            this.handlers.get(channel)!.add(callback)
        } finally {
            release()
        }
    }

    async unsubscribe(channel: string, callback?: (message: string) => void): Promise<void> {
        const mutex = this.getMutex(channel)
        const release = await mutex.acquire()

        try {
            if (!this.handlers.has(channel)) return

            const callbacks = this.handlers.get(channel)!

            if (callback) {
                callbacks.delete(callback)
                if (callbacks.size === 0) {
                    await this.redisSub.unsubscribe(channel)
                    this.handlers.delete(channel)
                    this.channelMutexes.delete(channel)
                }
            } else {
                await this.redisSub.unsubscribe(channel)
                this.handlers.delete(channel)
                this.channelMutexes.delete(channel)
            }
        } finally {
            release()
        }
    }

    async shutdown(): Promise<void> {
        const channels = Array.from(this.handlers.keys())

        for (const channel of channels) {
            await this.unsubscribe(channel)
        }
    }
}