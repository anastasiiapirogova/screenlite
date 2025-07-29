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
}

export type IImageProcessor = {
    getImageMetadata(readStream: Readable): Promise<ImageMetadata>
    processImage(imageBuffer: Buffer, options?: ImageProcessingOptions): Promise<Buffer>
}