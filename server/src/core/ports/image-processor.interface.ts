import { Readable } from 'stream'

export type ImageMetadata = {
    width: number
    height: number
}

export type IImageProcessor = {
    getImageMetadata(readStream: Readable): Promise<ImageMetadata>
}