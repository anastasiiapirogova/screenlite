export class WorkspaceSlug {
    constructor(public readonly value: string) {
        if (!value || value.trim().length < 3) {
            throw new Error('Slug must be at least 3 characters long')
        }

        if (value.length > 30) {
            throw new Error('Slug cannot be longer than 30 characters')
        }

        if (!/^[a-z0-9-]+$/.test(value)) {
            throw new Error('Slug can only contain lowercase letters, numbers, and hyphens')
        }
        
        if (value.startsWith('-') || value.endsWith('-')) {
            throw new Error('Slug cannot start or end with a hyphen')
        }
        
        if (value.includes('--')) {
            throw new Error('Slug cannot contain consecutive hyphens')
        }
    }
}