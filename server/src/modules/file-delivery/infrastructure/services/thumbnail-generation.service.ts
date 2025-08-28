import { ImageFile } from '@/core/entities/image-file.entity.ts'
import { IEtagService } from '@/core/ports/etag-service.interface.ts'
import { IImageProcessor } from '@/core/ports/image-processor.interface.ts'
import { IStorage } from '@/core/ports/storage.interface.ts'

interface ThumbnailGenerationServiceDeps {
    storage: IStorage
    imageProcessor: IImageProcessor
    etagService: IEtagService
}

export class ThumbnailGenerationService {
    constructor(
        private readonly deps: ThumbnailGenerationServiceDeps,
    ) {}
  
    async generateThumbnail(
        fileKey: string,
        options: { maxWidth?: number, maxHeight?: number }
    ) {
        const { storage, imageProcessor, etagService } = this.deps

        const [metadata, fileBuffer] = await Promise.all([
            storage.getMetadata(fileKey),
            storage.getFileBuffer(fileKey)
        ])

        const imageFile = ImageFile.create(fileKey, metadata.mimeType, fileBuffer)

        const imageMetadata = await imageProcessor.getImageMetadata(imageFile.buffer)

        const isWidthLargerThanImage = options.maxWidth && imageMetadata.width < options.maxWidth
        const isHeightLargerThanImage = options.maxHeight && imageMetadata.height < options.maxHeight
        const isThumbnailLargerThanImage = isWidthLargerThanImage || isHeightLargerThanImage

        if (isThumbnailLargerThanImage) {
            return {
                buffer: imageFile.buffer,
                mimeType: imageFile.mimeType,
                contentLength: imageFile.buffer.length,
                etag: etagService.generate(imageFile.buffer)
            }
        }

        const processedImage = await imageProcessor.process(imageFile.buffer, {
            ...options,
            format: 'webp',
            quality: 80
        })
  
        return {
            buffer: processedImage,
            mimeType: 'image/webp',
            contentLength: processedImage.length,
            etag: etagService.generate(processedImage)
        }
    }
}