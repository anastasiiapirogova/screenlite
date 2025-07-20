export type IMessageChannelSubscriptionManager = {
    subscribe(channel: string, handler: (message: string) => void): Promise<void>
    unsubscribe(channel: string): Promise<void>
    shutdown(): Promise<void>
}