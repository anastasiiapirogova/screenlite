import sharp from 'sharp'
import { Readable } from 'stream'
import { ImageMetadata, IImageProcessor, ImageProcessingOptions } from '@/core/ports/image-processor.interface.ts'

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

    public async process(
        imageBuffer: Buffer,
        options?: ImageProcessingOptions
    ): Promise<Buffer> {
        let image = sharp(imageBuffer)
    
        if (options?.width || options?.height) {
            image = image.resize(options.width, options.height, {
                fit: 'cover',
                background: { r: 255, g: 255, b: 255, alpha: 1 },
            })
        }
    
        if (options?.format) {
            image = image[options.format]({
                quality: options?.quality ?? 80,
            })
        }
    
        return image.toBuffer()
    }
}