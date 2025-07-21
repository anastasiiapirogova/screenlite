export type IWebSocketBroadcaster = {
    broadcastToChannel(channel: string, message: string): Promise<void>
    broadcastToConnection(connectionId: string, message: string):void
    broadcastToConnections(connectionIds: string[], message: string): void
}