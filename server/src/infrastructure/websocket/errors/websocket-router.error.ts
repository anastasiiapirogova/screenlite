export class WebSocketHandlerNotFoundError extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'WebSocketHandlerNotFoundError'
    }
}