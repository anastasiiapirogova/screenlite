export class ResourceConflictError extends Error {
    constructor(public readonly details: Record<string, string[]>) {
        super('RESOURCE_CONFLICT')
        this.name = 'ResourceConflictError'
    }
}