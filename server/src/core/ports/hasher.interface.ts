export interface IHasher {
    hash(password: string): Promise<string>
    compare(password: string, hash: string): Promise<boolean>
}