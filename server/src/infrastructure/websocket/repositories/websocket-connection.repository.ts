import { WebSocketConnection } from '@/core/entities/websocket-connection.entity.ts'
import { IWebSocketConnectionRepository } from '@/core/ports/websocket-connection.repository.interface.ts'

export class WebSocketConnectionRepository implements IWebSocketConnectionRepository {
    private readonly connections = new Map<string, WebSocketConnection>()
  
    getAllConnections(): WebSocketConnection[] {
        return Array.from(this.connections.values())
    }

    getConnection(connectionId: string): WebSocketConnection | undefined {
        return this.connections.get(connectionId)
    }

    removeConnection(connectionId: string): void {
        this.connections.delete(connectionId)
    }
  
    registerConnection(connectionId: string, connection: WebSocketConnection): void {
        this.connections.set(connectionId, connection)
    }
  
    unregisterConnection(connectionId: string): boolean {
        const connection = this.connections.get(connectionId)

        if (!connection) return true

        connection.terminate()
        this.connections.delete(connectionId)
        return true
    }

    terminateAllConnections(): void {
        this.connections.forEach(conn => {
            if (!conn.isClosed()) {
                conn.terminate()
            }
        })
        this.connections.clear()
    }
}