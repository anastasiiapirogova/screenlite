import { Readable } from 'stream'

export type ImageMetadata = {
    width: number
    height: number
}

export type ImageProcessor = {
    getImageMetadata(readStream: Readable): Promise<ImageMetadata>
}