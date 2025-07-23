export interface SessionTokenParser {
    parse(token: string): Promise<string>
}