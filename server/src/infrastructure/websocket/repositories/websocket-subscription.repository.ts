import { IWebSocketSubscriptionRepository } from '@/core/ports/websocket-subscription.repository.interface.ts'

export class WebSocketSubscriptionRepository implements IWebSocketSubscriptionRepository {
    private readonly channelSubscriptions = new Map<string, Set<string>>()
    private readonly connectionSubscriptions = new Map<string, Set<string>>()

    subscribe(connectionId: string, channel: string): void {
        this.ensureChannelExists(channel).add(connectionId)
        this.ensureConnectionExists(connectionId).add(channel)
    }

    unsubscribe(connectionId: string, channel: string): boolean {
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
    }

    unsubscribeFromAllChannels(connectionId: string): string[] {
        const channels = this.connectionSubscriptions.get(connectionId)

        if (!channels) return []

        const emptiedChannels: string[] = []

        for (const channel of Array.from(channels)) {
            const isEmpty = this.unsubscribe(connectionId, channel)

            if (isEmpty) emptiedChannels.push(channel)
        }
        return emptiedChannels
    }

    getSubscribedChannels(connectionId: string): string[] {
        return Array.from(this.connectionSubscriptions.get(connectionId) || [])
    }

    getConnectionsForChannel(channel: string): string[] {
        return Array.from(this.channelSubscriptions.get(channel) || [])
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