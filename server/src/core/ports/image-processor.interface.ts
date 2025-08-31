import { Readable } from 'stream'

export type ImageMetadata = {
    width: number
    height: number
}

export type ImageProcessingOptions = {
    width?: number
    height?: number
    format?: 'jpeg' | 'png' | 'webp'
    quality?: number
    maxWidth?: number
    maxHeight?: number
    mimeType?: string
}

export type IImageProcessor = {
    getImageMetadata(readStream: Readable | Buffer): Promise<ImageMetadata>
    process(imageBuffer: Buffer, options?: ImageProcessingOptions): Promise<{ buffer: Buffer, mimeType: string }>
}