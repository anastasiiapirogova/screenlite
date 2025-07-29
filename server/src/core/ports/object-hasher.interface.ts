export type IObjectHasher = {
    hash(value: unknown): Promise<string>
    compare(value: unknown, hash: string): Promise<boolean>
}