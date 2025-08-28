export class WorkspaceName {
    constructor(public readonly value: string) {
        if (!value || value.trim().length < 3) {
            throw new Error('Workspace name must be at least 3 characters long')
        }

        if (value.length > 100) {
            throw new Error('Workspace name cannot be longer than 100 characters')
        }
    }
}