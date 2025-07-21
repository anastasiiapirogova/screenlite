import { WebSocketConnection } from '@/core/entities/websocket-connection.entity.ts'

export type IWebSocketConnectionRepository = {
    getAllConnections(): WebSocketConnection[]
    getConnection(connectionId: string): WebSocketConnection | undefined
    addConnection(connection: WebSocketConnection): void
    deleteConnection(connectionId: string): void
    terminateAllConnections(): void
}