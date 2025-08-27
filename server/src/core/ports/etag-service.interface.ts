export interface IEtagService {
    generate(buffer: Buffer): string
}