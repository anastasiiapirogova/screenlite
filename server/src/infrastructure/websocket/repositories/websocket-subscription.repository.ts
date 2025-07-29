import { IWebSocketSubscriptionRepository } from '@/core/ports/websocket-subscription.repository.interface.ts'
import { Mutex } from 'async-mutex'

export class WebSocketSubscriptionRepository implements IWebSocketSubscriptionRepository {
    private readonly channelSubscriptions = new Map<string, Set<string>>()
    private readonly connectionSubscriptions = new Map<string, Set<string>>()
    private readonly mutex = new Mutex()

    async subscribe(connectionId: string, channel: string): Promise<void> {
        const release = await this.mutex.acquire()

        try {
            this.ensureChannelExists(channel).add(connectionId)
            this.ensureConnectionExists(connectionId).add(channel)
        } finally {
            release()
        }
    }

    async unsubscribe(connectionId: string, channel: string): Promise<boolean> {
        const release = await this.mutex.acquire()

        try {
            const channelSubs = this.channelSubscriptions.get(channel)
            const connectionSubs = this.connectionSubscriptions.get(connectionId)
            
            if (!channelSubs || !connectionSubs) return false
            
            channelSubs.delete(connectionId)
            connectionSubs.delete(channel)
            
            if (channelSubs.size === 0) {
                this.channelSubscriptions.delete(channel)
            }
            
            if (connectionSubs.size === 0) {
                this.connectionSubscriptions.delete(connectionId)
            }
            
            return channelSubs.size === 0
        } finally {
            release()
        }
    }

    async unsubscribeFromAllChannels(connectionId: string): Promise<string[]> {
        const release = await this.mutex.acquire()

        try {
            const channels = this.connectionSubscriptions.get(connectionId)

            if (!channels) return []

            const emptiedChannels: string[] = []
            const channelsCopy = new Set(channels)

            for (const channel of channelsCopy) {
                const isEmpty = await this.unsubscribe(connectionId, channel)

                if (isEmpty) emptiedChannels.push(channel)
            }
            return emptiedChannels
        } finally {
            release()
        }
    }

    async getSubscribedChannels(connectionId: string): Promise<string[]> {
        const release = await this.mutex.acquire()

        try {
            return Array.from(this.connectionSubscriptions.get(connectionId) || [])
        } finally {
            release()
        }
    }

    async getConnectionsForChannel(channel: string): Promise<string[]> {
        const release = await this.mutex.acquire()

        try {
            return Array.from(this.channelSubscriptions.get(channel) || [])
        } finally {
            release()
        }
    }

    private ensureChannelExists(channel: string): Set<string> {
        if (!this.channelSubscriptions.has(channel)) {
            this.channelSubscriptions.set(channel, new Set())
        }
        return this.channelSubscriptions.get(channel)!
    }

    private ensureConnectionExists(connectionId: string): Set<string> {
        if (!this.connectionSubscriptions.has(connectionId)) {
            this.connectionSubscriptions.set(connectionId, new Set())
        }
        return this.connectionSubscriptions.get(connectionId)!
    }
}