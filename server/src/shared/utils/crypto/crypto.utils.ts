import crypto from 'crypto'

export function stableStringify(obj: unknown): string {
    if (typeof obj !== 'object' || obj === null) return String(obj)
    if (Array.isArray(obj)) return `[${obj.map(stableStringify).join(',')}]`
    
    return `{${Object.keys(obj)
        .sort()
        .map(key => `${key}:${stableStringify((obj as Record<string, unknown>)[key])}`)
        .join(',')}}`
}

export const hashValue = (value: unknown): string => {
    const str = typeof value === 'string' ? value : stableStringify(value)

    return crypto.createHash('sha256').update(str).digest('hex')
}

export const compareHash = (value: unknown, hash: string): boolean => {
    return hashValue(value) === hash
}