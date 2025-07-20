import { IMessageBroker } from '@/core/ports/messaging.interface.ts'
import { Redis } from 'ioredis'

export class RedisMessageBrokerAdapter implements IMessageBroker {
    constructor(private redisPub: Redis, private redisSub: Redis) {}

    async publish(channel: string, message: string): Promise<void> {
        await this.redisPub.publish(channel, message)
    }

    async subscribe(channel: string, callback: (message: string) => void): Promise<void> {
        await this.redisSub.subscribe(channel)

        this.redisSub.on('message', (ch, msg) => {
            if (ch === channel) callback(msg)
        })
    }

    async unsubscribe(channel: string): Promise<void> {
        await this.redisSub.unsubscribe(channel)
    }
}