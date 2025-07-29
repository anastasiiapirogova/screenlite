import { IncomingMessage } from 'node:http'
import { WebSocket } from 'ws'

export type IWebSocketService = {
    subscribe(connectionId: string, channel: string): Promise<void>
    unsubscribe(connectionId: string, channel?: string): Promise<void>
    broadcast(channel: string, message: string): Promise<void>
    shutdown(): Promise<void>
}

export type IWebSocketConnectionManager = {
    handleConnection(request: IncomingMessage, connection: WebSocket): void
    shutdown(): void
}