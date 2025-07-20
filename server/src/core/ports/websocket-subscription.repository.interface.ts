export type IWebSocketSubscriptionRepository = {
    subscribe(connectionId: string, channel: string): void
    unsubscribe(connectionId: string, channel: string): boolean
    unsubscribeFromAllChannels(connectionId: string): string[]
    getSubscribedChannels(connectionId: string): string[]
    getConnectionsForChannel(channel: string): string[]
}