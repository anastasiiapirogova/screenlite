export interface ITokenParser<T> {
    parse(value: string): Promise<T>
}