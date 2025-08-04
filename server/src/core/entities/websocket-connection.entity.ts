import type { WebSocket } from 'ws'
import type { WebSocketConnectionDTO } from '@/shared/dto/websocket-connection.dto.ts'

export class WebSocketConnection {
    public readonly id: string
    public readonly socket: WebSocket
    public readonly createdAt: Date
    private _isAlive: boolean

    constructor(dto: WebSocketConnectionDTO) {
        this.id = dto.id
        this.socket = dto.socket
        this.createdAt = dto.createdAt
        this._isAlive = dto.isAlive
    }

    get isAlive(): boolean {
        return this._isAlive
    }

    setIsAlive(value: boolean): void {
        this._isAlive = value
    }

    isOpen(): boolean {
        return this.socket.readyState === this.socket.OPEN
    }

    isClosed(): boolean {
        return this.socket.readyState === this.socket.CLOSED
    }

    isClosing(): boolean {
        return this.socket.readyState === this.socket.CLOSING
    }

    safeSend(data: string | Buffer): boolean {
        if (this.isOpen()) {
            try {
                this.socket.send(data)
                return true
            } catch (error) {
                console.error(`Failed to send message to connection ${this.id}:`, error)
                return false
            }
        }
        return false
    }

    terminate(): void {
        this.socket.terminate()
    }
}