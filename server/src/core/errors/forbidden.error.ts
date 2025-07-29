export class ForbiddenError extends Error {
    constructor(
        public readonly details: Record<string, string[]>
    ) {
        super('Forbidden Error')
    }
}