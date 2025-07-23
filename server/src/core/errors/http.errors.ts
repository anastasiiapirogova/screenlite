export class HttpError extends Error {
    constructor(
        public readonly statusCode: number,
        message: string,
        public readonly error?: string
    ) {
        super(message)
        this.name = this.constructor.name
    }
}
  
export class UnauthorizedError extends HttpError {
    constructor(message = 'Unauthorized') {
        super(401, message, 'Unauthorized')
    }
}