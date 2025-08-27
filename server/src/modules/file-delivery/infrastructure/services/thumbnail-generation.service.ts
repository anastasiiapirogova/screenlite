import { ImageFile } from '@/core/entities/image-file.entity.ts'
import { IEtagService } from '@/core/ports/etag-service.interface.ts'
import { IImageProcessor } from '@/core/ports/image-processor.interface.ts'
import { IStorage } from '@/core/ports/storage.interface.ts'
import { ValidationError } from '@/shared/errors/validation.error.ts'

export class ThumbnailGenerationService {
    constructor(
        private storage: IStorage,
        private imageProcessor: IImageProcessor,
        private etagService: IEtagService
    ) {}
  
    async generateThumbnail(
        fileKey: string,
        options: { maxWidth?: number, maxHeight?: number }
    ) {
        const [metadata, fileBuffer] = await Promise.all([
            this.storage.getMetadata(fileKey),
            this.storage.getFileBuffer(fileKey)
        ])

        const imageFile = ImageFile.create(fileKey, metadata.mimeType, fileBuffer)

        const imageMetadata = await this.imageProcessor.getImageMetadata(imageFile.buffer)

        const isWidthLargerThanImage = options.maxWidth && imageMetadata.width < options.maxWidth
        const isHeightLargerThanImage = options.maxHeight && imageMetadata.height < options.maxHeight
        const isThumbnailLargerThanImage = isWidthLargerThanImage || isHeightLargerThanImage

        if (isThumbnailLargerThanImage) {
            throw new ValidationError({
                fileKey: ['INVALID_THUMBNAIL_SIZE']
            })
        }

        const processedImage = await this.imageProcessor.process(imageFile.buffer, {
            ...options,
            format: 'webp',
            quality: 80
        })
  
        return {
            buffer: processedImage,
            mimeType: 'image/webp',
            contentLength: processedImage.length,
            etag: this.etagService.generate(processedImage)
        }
    }
}