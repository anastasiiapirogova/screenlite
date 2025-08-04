export class ValidationError extends Error {
    constructor(
        public readonly details: Record<string, string[]>
    ) {
        super('Validation Error')
    }
}