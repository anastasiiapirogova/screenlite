import { IMessageChannelSubscriptionManager } from '@/core/ports/message-channel-subscription-manager.interface.ts'
import type { IMessageBroker } from '@/core/ports/messaging.interface.ts'

const LOG_MESSAGES = {
    SUBSCRIBE: (channel: string) => `Subscribed to broker channel: ${channel}`,
    UNSUBSCRIBE: (channel: string) => `Unsubscribed from broker channel: ${channel}`,
    SHUTDOWN: 'Message broker subscriptions shutdown completed',
} as const

const ERROR_MESSAGES = {
    SUBSCRIBE_FAILED: (channel: string) => `Failed to subscribe to ${channel}`,
    UNSUBSCRIBE_FAILED: (channel: string) => `Failed to unsubscribe from ${channel}`,
    SHUTDOWN_FAILED: 'Error during message broker unsubscription',
} as const

export class MessageChannelSubscriptionManager implements IMessageChannelSubscriptionManager {
    private readonly channelHandlers = new Map<string, Set<(message: string) => void>>()
    private isShuttingDown = false

    constructor(private readonly messageBroker: IMessageBroker) {}

    async subscribe(channel: string, handler: (message: string) => void): Promise<void> {
        if (this.isShuttingDown) return

        const existingHandlers = this.channelHandlers.get(channel)

        if (existingHandlers) {
            if (!existingHandlers.has(handler)) {
                existingHandlers.add(handler)
            }
            return
        }

        this.channelHandlers.set(channel, new Set([handler]))

        try {
            await this.messageBroker.subscribe(channel, (message: string) => {
                const handlers = this.channelHandlers.get(channel)

                if (handlers) {
                    for (const handler of handlers) {
                        try {
                            handler(message)
                        } catch (err) {
                            console.error(`Error in handler for channel "${channel}":`, err)
                        }
                    }
                }
            })

            console.log(LOG_MESSAGES.SUBSCRIBE(channel))
        } catch (error) {
            console.error(ERROR_MESSAGES.SUBSCRIBE_FAILED(channel), error)
            this.channelHandlers.delete(channel)
            throw error
        }
    }

    async unsubscribe(channel: string, handler?: (message: string) => void): Promise<void> {
        const handlers = this.channelHandlers.get(channel)

        if (!handlers) return

        if (handler) {
            handlers.delete(handler)
        }

        if (!handler || handlers.size === 0) {
            try {
                await this.messageBroker.unsubscribe(channel)
                this.channelHandlers.delete(channel)
                console.log(LOG_MESSAGES.UNSUBSCRIBE(channel))
            } catch (error) {
                console.error(ERROR_MESSAGES.UNSUBSCRIBE_FAILED(channel), error)
                throw error
            }
        }
    }

    async shutdown(): Promise<void> {
        this.isShuttingDown = true

        const channels = Array.from(this.channelHandlers.keys())

        try {
            await Promise.allSettled(
                channels.map(channel => this.unsubscribe(channel))
            )
            console.log(LOG_MESSAGES.SHUTDOWN)
        } catch (error) {
            console.error(ERROR_MESSAGES.SHUTDOWN_FAILED, error)
            throw error
        }
    }
}
