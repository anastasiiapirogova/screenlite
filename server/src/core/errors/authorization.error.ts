export class AuthorizationError extends Error {
    constructor(
        public readonly details: Record<string, string[]>
    ) {
        super('Authorization Error')
    }
}