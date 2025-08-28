export class ForbiddenError extends Error {
    constructor(
        public readonly details: Record<string, string[]>,
        public readonly message: string = 'Forbidden Error'
    ) {
        super(message)
    }
}