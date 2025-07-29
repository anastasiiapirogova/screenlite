export type IMessageBroker = {
    publish(channel: string, message: string): Promise<void>
    subscribe(channel: string, callback: (message: string) => void): Promise<void>
    unsubscribe(channel: string): Promise<void>
}