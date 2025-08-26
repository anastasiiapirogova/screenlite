import { ImageProcessingOptions } from '../ports/image-processor.interface.ts'

export class ProfilePhotoSpecification {
    private static readonly DEFAULT_WIDTH = 512
    private static readonly DEFAULT_HEIGHT = 512
    private static readonly DEFAULT_FORMAT = 'jpeg' as const
    private static readonly DEFAULT_QUALITY = 80
  
    static getDefault(): ImageProcessingOptions {
        return {
            width: this.DEFAULT_WIDTH,
            height: this.DEFAULT_HEIGHT,
            format: this.DEFAULT_FORMAT,
            quality: this.DEFAULT_QUALITY,
        }
    }
}