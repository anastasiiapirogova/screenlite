import { WebSocketConnection } from '../entities/websocket-connection.entity.ts'

export type MessageHandler = (connection: WebSocketConnection, message: object) => Promise<void> | void

export type IWebSocketRouter = {
    registerHandler(messageType: string, handler: MessageHandler): void
    onConnection(connectionId: string): void
    onMessage(connectionId: string, message: string): void
}