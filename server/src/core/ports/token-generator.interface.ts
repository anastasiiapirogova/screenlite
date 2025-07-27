export type ITokenGenerator = {
    generate(length?: number, prefix?: string): string
}