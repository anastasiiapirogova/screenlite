import sharp from 'sharp'
import { Readable } from 'stream'
import { ImageMetadata, IImageProcessor, ImageProcessingOptions } from '@/core/ports/image-processor.interface.ts'

export class SharpImageProcessor implements IImageProcessor {
    public async getImageMetadata(readStream: Readable | Buffer): Promise<ImageMetadata> {
        const transformer = sharp()

        if (readStream instanceof Readable) {
            readStream.pipe(transformer)
        } else {
            transformer.end(readStream)
        }

        const metadata = await transformer.metadata()

        return {
            width: metadata.width ?? 0,
            height: metadata.height ?? 0,
        }
    }

    public async process(
        imageBuffer: Buffer,
        options?: ImageProcessingOptions
    ): Promise<{ buffer: Buffer, mimeType: string }> {
        let image = sharp(imageBuffer)
    
        if (options?.width || options?.height) {
            image = image.resize(options.width, options.height, {
                fit: 'cover',
                background: { r: 255, g: 255, b: 255, alpha: 1 },
            })
        }

        if (options?.maxWidth || options?.maxHeight) {
            image = image.resize(options.maxWidth, options.maxHeight, {
                fit: 'inside',
            })
        }
    
        if (options?.format) {
            image = image[options.format]({
                quality: options?.quality ?? 80,
            })
        }

        const buffer = await image.toBuffer()
        const mimeType = options?.mimeType ?? 'image/jpeg'
        
        return {
            buffer,
            mimeType,
        }
    }
}