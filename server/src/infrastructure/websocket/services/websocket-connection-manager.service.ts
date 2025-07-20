import { IncomingMessage } from 'node:http'
import type { WebSocket } from 'ws'
import { v4 as uuidv4 } from 'uuid'

import { IWebSocketConnectionManager } from '@/core/ports/websocket.interface.ts'
import { WebSocketConnection } from '@/core/entities/websocket-connection.entity.ts'
import { IWebSocketConnectionRepository } from '@/core/ports/websocket-connection.repository.interface.ts'

const HEARTBEAT_INTERVAL = 30000

export class WebSocketConnectionManager implements IWebSocketConnectionManager {
    private readonly interval: NodeJS.Timeout
    private readonly connectionRepository: IWebSocketConnectionRepository

    private readonly onMessage: (connectionId: string, message: string) => void
    private readonly onClose: (connectionId: string) => void
    private readonly onError: (connectionId: string, error: unknown) => void
    private readonly onConnect?: (connectionId: string) => void

    constructor({
        connectionRepository,
        onMessage,
        onClose,
        onError,
        onConnect,
    }: {
        connectionRepository: IWebSocketConnectionRepository
        onMessage: (connectionId: string, message: string) => void
        onClose: (connectionId: string) => void
        onError: (connectionId: string, error: unknown) => void
        onConnect?: (connectionId: string) => void
    }) {
        this.connectionRepository = connectionRepository
        this.onMessage = onMessage
        this.onClose = onClose
        this.onError = onError
        this.onConnect = onConnect

        this.interval = setInterval(() => {
            this.connectionRepository.getAllConnections().forEach((websocketConnection: WebSocketConnection) => {
                if (!websocketConnection.isAlive) {
                    this.connectionRepository.unregisterConnection(websocketConnection.id)
                    return
                }

                if (websocketConnection.isClosed()) {
                    this.connectionRepository.unregisterConnection(websocketConnection.id)
                    return
                }

                if (websocketConnection.isClosing()) {
                    this.connectionRepository.unregisterConnection(websocketConnection.id)
                    return
                }

                websocketConnection.setIsAlive(false)
                websocketConnection.socket.ping()
            })
        }, HEARTBEAT_INTERVAL)
    }

    handleConnection(request: IncomingMessage, connection: WebSocket): void {
        const connectionId = this.generateConnectionId()

        const websocketConnection = new WebSocketConnection({
            id: connectionId,
            socket: connection,
            createdAt: new Date(),
            isAlive: true
        })

        websocketConnection.socket.on('pong', () => {
            websocketConnection.setIsAlive(true)
        })

        this.connectionRepository.registerConnection(connectionId, websocketConnection)

        this.onConnect?.(connectionId)

        websocketConnection.socket.on('message', (data) => {
            this.onMessage(connectionId, data.toString())
        })

        websocketConnection.socket.on('close', () => {
            this.connectionRepository.removeConnection(connectionId)
            this.onClose(connectionId)
        })

        websocketConnection.socket.on('error', (err) => {
            this.connectionRepository.unregisterConnection(connectionId)
            this.onError(connectionId, err)
        })
    }

    private generateConnectionId(): string {
        return uuidv4()
    }

    private stopHeartbeat(): void {
        clearInterval(this.interval)
    }

    shutdown(): void {
        this.stopHeartbeat()
    }
}