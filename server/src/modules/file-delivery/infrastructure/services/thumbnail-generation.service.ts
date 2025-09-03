import { ImageFile } from '@/core/entities/image-file.entity.ts'
import { IImageProcessor } from '@/core/ports/image-processor.interface.ts'
import { IStorage } from '@/core/ports/storage.interface.ts'
import { Thumbnail } from '@/core/value-objects/thumbnail.vo.ts'

interface ThumbnailGenerationServiceDeps {
    storage: IStorage
    imageProcessor: IImageProcessor
}

export class ThumbnailGenerationService {
    constructor(
        private readonly deps: ThumbnailGenerationServiceDeps,
    ) {}
  
    async generateThumbnail(
        fileKey: string,
        options: { maxWidth?: number, maxHeight?: number }
    ) {
        const { storage, imageProcessor } = this.deps

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
            return Thumbnail.create(imageFile.buffer, imageFile.mimeType)
        }

        const processedImage = await imageProcessor.process(imageFile.buffer, {
            ...options,
            format: 'webp',
            quality: 80
        })

        return Thumbnail.create(processedImage.buffer, processedImage.mimeType)
    }
}