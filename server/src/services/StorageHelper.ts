import sharp from 'sharp'
import { StorageService } from './storage/StorageService.ts'

export class StorageHelper {
    public static async uploadAndProcessImage(key: string, imageBuffer: Buffer, options?: {
        width?: number
        height?: number
        format?: 'jpeg' | 'png' | 'webp'
        quality?: number
    }): Promise<void> {
        let processedImage = sharp(imageBuffer)

        if (options?.width || options?.height) {
            processedImage = processedImage.resize(options.width, options.height, {
                fit: 'cover',
                background: { r: 255, g: 255, b: 255 }
            })
        }

        if (options?.format) {
            processedImage = processedImage[options.format]({
                quality: options?.quality || 80
            })
        }

        const processedBuffer = await processedImage.toBuffer()

        await StorageService.getInstance().uploadFile(key, processedBuffer, `image/${options?.format || 'jpeg'}`)
    }
}
