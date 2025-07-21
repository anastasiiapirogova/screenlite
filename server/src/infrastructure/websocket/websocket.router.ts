import { WebSocketConnection } from '@/core/entities/websocket-connection.entity.ts'
import { IWebSocketConnectionRepository } from '@/core/ports/websocket-connection.repository.interface.ts'
import { IWebSocketRouter, MessageHandler } from '@/core/ports/websocket-router.interface.ts'
import { WebSocketHandlerNotFoundError } from './errors/websocket-router.error.ts'

export class WebSocketRouter implements IWebSocketRouter {
    private connectionRepository: IWebSocketConnectionRepository
    private handlers = new Map<string, MessageHandler>()

    constructor(connectionRepository: IWebSocketConnectionRepository) {
        this.connectionRepository = connectionRepository
    }

    registerHandler(messageType: string, handler: MessageHandler) {
        this.handlers.set(messageType, handler)
    }

    onMessage(connectionId: string, message: Buffer) {
        const connection = this.connectionRepository.getConnection(connectionId)

        if (!connection) return

        this.routeMessage(connection, message)
    }

    onConnection(connectionId: string) {
        const connection = this.connectionRepository.getConnection(connectionId)

        if (!connection) return

        connection.socket.send(JSON.stringify({
            type: 'welcome',
        }))
    }

    private routeMessage(connection: WebSocketConnection, rawData: Buffer) {
        try {
            const message = JSON.parse(rawData.toString())
            const handler = this.handlers.get(message.type)
      
            if (!handler) {
                throw new WebSocketHandlerNotFoundError(`No handler for type: ${message.type}`)
            }
      
            handler(connection, message)
        } catch (err) {
            if (err instanceof WebSocketHandlerNotFoundError) {
                this.sendError(connection, 'handler_not_found', err.message)
            } else {
                this.sendError(connection, 'invalid_message_format', 'Invalid message format')
            }
        }
    }

    private sendError(connection: WebSocketConnection, error: string, message: string) {
        connection.socket.send(JSON.stringify({
            type: 'error',
            error,
            message
        }))
    }
}