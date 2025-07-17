export class FileNotFoundError extends Error {
    constructor(key: string) {
        super(`File not found: ${key}`)
        this.name = 'FileNotFoundError'
    }
} 