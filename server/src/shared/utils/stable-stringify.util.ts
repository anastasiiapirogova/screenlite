export function stableStringify(obj: unknown): string {
    if (typeof obj !== 'object' || obj === null) return String(obj)
    if (Array.isArray(obj)) return `[${obj.map(stableStringify).join(',')}]`
    
    return `{${Object.keys(obj)
        .sort()
        .map(key => `${key}:${stableStringify((obj as Record<string, unknown>)[key])}`)
        .join(',')}}`
}