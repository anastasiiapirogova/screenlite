export class Thumbnail {
    private constructor(
        public readonly buffer: Buffer,
        public readonly mimeType: string,
        public readonly contentLength: number,
    ) {}

    static create(buffer: Buffer, mimeType: string): Thumbnail {
        return new Thumbnail(buffer, mimeType, buffer.length)
    }
}