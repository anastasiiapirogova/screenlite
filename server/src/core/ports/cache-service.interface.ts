export type ICacheService = {
    exists(key: string): Promise<boolean>
    get(key: string): Promise<string | null>
    set(key: string, value: string, ttlSeconds?: number): Promise<void>
    delete(key: string): Promise<void>
    clear(): Promise<void>
}