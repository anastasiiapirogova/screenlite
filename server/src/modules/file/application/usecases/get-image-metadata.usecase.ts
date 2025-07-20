import { IImageProcessor } from '@/core/ports/image-processor.interface.ts'
import { Readable } from 'stream'

export class GetImageMetadataUseCase {
    constructor(private readonly imageProcessor: IImageProcessor) {}

    async execute(readStream: Readable) {
        return this.imageProcessor.getImageMetadata(readStream)
    }
}