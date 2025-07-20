import { WebSocketConnection } from '@/core/entities/websocket-connection.entity.ts'

export type IWebSocketConnectionRepository = {
    getAllConnections(): WebSocketConnection[]
    getConnection(connectionId: string): WebSocketConnection | undefined
    removeConnection(connectionId: string): void
    registerConnection(connectionId: string, connection: WebSocketConnection): void
    unregisterConnection(connectionId: string): boolean
    terminateAllConnections(): void
}