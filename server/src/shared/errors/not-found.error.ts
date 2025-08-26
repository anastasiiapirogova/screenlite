export class NotFoundError extends Error {
    constructor(message: string = 'NOT_FOUND') {
        super(message)
    }
}