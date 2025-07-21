export type IWebSocketSubscriptionRepository = {
    subscribe(connectionId: string, channel: string): Promise<void>
    unsubscribe(connectionId: string, channel: string): Promise<boolean>
    unsubscribeFromAllChannels(connectionId: string): Promise<string[]>
    getSubscribedChannels(connectionId: string): Promise<string[]>
    getConnectionsForChannel(channel: string): Promise<string[]>
}