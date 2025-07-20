import sharp from 'sharp'
import { Readable } from 'stream'
import { ImageMetadata, IImageProcessor } from '@/core/ports/image-processor.interface.ts'

export class SharpImageProcessor implements IImageProcessor {
    public async getImageMetadata(readStream: Readable): Promise<ImageMetadata> {
        const transformer = sharp()

        readStream.pipe(transformer)
        const metadata = await transformer.metadata()

        return {
            width: metadata.width ?? 0,
            height: metadata.height ?? 0,
        }
    }
}