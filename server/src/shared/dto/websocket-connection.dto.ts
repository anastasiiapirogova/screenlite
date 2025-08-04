import type { WebSocket } from 'ws'

export type WebSocketConnectionDTO = {
    id: string
    socket: WebSocket
    createdAt: Date
    isAlive: boolean
} 