import { IncomingMessage } from 'node:http'
import { EventEmitter } from 'node:events'
import type { RawData, WebSocket } from 'ws'
import { v4 as uuidv4 } from 'uuid'

import { IWebSocketConnectionManager } from '@/core/ports/websocket.interface.ts'
import { WebSocketConnection } from '@/core/entities/websocket-connection.entity.ts'
import { IWebSocketConnectionRepository } from '@/core/ports/websocket-connection.repository.interface.ts'

const HEARTBEAT_INTERVAL = 30000

export enum WebSocketEvents {
    CONNECT = 'connect',
    MESSAGE = 'message',
    CLOSE = 'close',
    ERROR = 'error',
    PONG = 'pong'
}

export class WebSocketConnectionManager extends EventEmitter implements IWebSocketConnectionManager {
    private connectionRepository: IWebSocketConnectionRepository
    private interval: NodeJS.Timeout

    constructor(connectionRepository: IWebSocketConnectionRepository) {
        super()
        this.connectionRepository = connectionRepository
        this.interval = this.startHeartbeat()
    }

    handleConnection(request: IncomingMessage, socket: WebSocket): void {
        const connectionId = this.generateConnectionId()

        const websocketConnection = new WebSocketConnection({
            id: connectionId,
            socket,
            createdAt: new Date(),
            isAlive: true
        })

        this.connectionRepository.registerConnection(connectionId, websocketConnection)
        this.emit(WebSocketEvents.CONNECT, connectionId)

        socket.on('pong', () => this.handlePong(connectionId))
        socket.on('message', (data) => this.handleMessage(connectionId, data))
        socket.on('close', () => this.handleClose(connectionId))
        socket.on('error', (err) => this.handleError(connectionId, err))
    }

    private handlePong(connectionId: string): void {
        this.connectionRepository.getConnection(connectionId)?.setIsAlive(true)
        this.emit(WebSocketEvents.PONG, connectionId)
    }

    private handleMessage(connectionId: string, data: RawData): void {
        this.emit(WebSocketEvents.MESSAGE, connectionId, data.toString())
    }

    private handleClose(connectionId: string): void {
        this.connectionRepository.removeConnection(connectionId)
        this.emit(WebSocketEvents.CLOSE, connectionId)
    }

    private handleError(connectionId: string, err: unknown): void {
        this.connectionRepository.unregisterConnection(connectionId)
        this.emit(WebSocketEvents.ERROR, connectionId, err)
    }

    private generateConnectionId(): string {
        return uuidv4()
    }

    private startHeartbeat(): NodeJS.Timeout {
        return setInterval(() => {
            this.connectionRepository.getAllConnections().forEach((websocketConnection: WebSocketConnection) => {
                if (!websocketConnection.isAlive) {
                    this.connectionRepository.unregisterConnection(websocketConnection.id)
                    return
                }

                if (websocketConnection.isClosed()) {
                    this.connectionRepository.removeConnection(websocketConnection.id)
                    return
                }

                if (websocketConnection.isClosing()) {
                    this.connectionRepository.removeConnection(websocketConnection.id)
                    return
                }

                websocketConnection.setIsAlive(false)
                websocketConnection.socket.ping()
            })
        }, HEARTBEAT_INTERVAL)
    }

    private stopHeartbeat(): void {
        clearInterval(this.interval)
    }

    shutdown(): void {
        this.stopHeartbeat()
    }
}