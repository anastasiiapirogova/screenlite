import { IWebSocketBroadcaster } from '@/core/ports/websocket-broadcaster.interface.ts'
import { IWebSocketSubscriptionRepository } from '@/core/ports/websocket-subscription.repository.interface.ts'
import { IWebSocketConnectionRepository } from '@/core/ports/websocket-connection.repository.interface.ts'

export class WebSocketBroadcaster implements IWebSocketBroadcaster {
    private connectionRepo: IWebSocketConnectionRepository
    private subscriptionRepo: IWebSocketSubscriptionRepository

    constructor(
        connectionRepo: IWebSocketConnectionRepository,
        subscriptionRepo: IWebSocketSubscriptionRepository
    ) {
        this.connectionRepo = connectionRepo
        this.subscriptionRepo = subscriptionRepo
    }

    broadcastToChannel(channel: string, message: string): void {
        const connectionIds = this.subscriptionRepo.getConnectionsForChannel(channel)
    
        this.broadcastToConnections(connectionIds, message)
    }

    broadcastToConnection(connectionId: string, message: string): void {
        const connection = this.connectionRepo.getConnection(connectionId)

        if (connection && !connection.isClosed()) {
            connection.socket.send(message)
        }
    }

    broadcastToConnections(connectionIds: string[], message: string): void {
        connectionIds.forEach(connectionId => {
            this.broadcastToConnection(connectionId, message)
        })
    }
}