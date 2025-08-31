import sharp from 'sharp'
import { IImageValidator } from '@/core/ports/image-validator.interface.ts'
import { ValidationError } from '@/shared/errors/validation.error.ts'

export class SharpImageValidator implements IImageValidator {
    async validateProfilePhoto(buffer: Buffer): Promise<void> {
        return this.validateImage(buffer, 'profilePhotoBuffer')
    }

    async validateWorkspacePicture(buffer: Buffer): Promise<void> {
        return this.validateImage(buffer, 'workspacePictureBuffer')
    }

    private async validateImage(buffer: Buffer, fieldName: string): Promise<void> {
        try {
            const metadata = await this.extractMetadata(buffer)

            this.validateMetadata(metadata, fieldName)
        } catch (error) {
            this.handleValidationError(error, fieldName)
        }
    }

    private async extractMetadata(buffer: Buffer): Promise<sharp.Metadata> {
        return sharp(buffer).metadata()
    }

    private validateMetadata(metadata: sharp.Metadata, fieldName: string): void {
        if (!this.isSupportedFormat(metadata.format)) {
            throw new ValidationError({
                [fieldName]: ['UNSUPPORTED_IMAGE_FORMAT']
            })
        }

        if (this.isDimensionsTooLarge(metadata.width, metadata.height)) {
            throw new ValidationError({
                [fieldName]: ['IMAGE_TOO_LARGE']
            })
        }

        if (this.isDimensionsInvalid(metadata.width, metadata.height)) {
            throw new ValidationError({
                [fieldName]: ['INVALID_IMAGE_DIMENSIONS']
            })
        }
    }

    private isSupportedFormat(format?: string): boolean {
        return ['jpeg', 'png', 'jpg', 'webp'].includes(format || '')
    }

    private isDimensionsTooLarge(width?: number, height?: number): boolean {
        return (width ?? 0) > 10000 || (height ?? 0) > 10000
    }

    private isDimensionsInvalid(width?: number, height?: number): boolean {
        return (width ?? 0) < 1 || (height ?? 0) < 1
    }

    private handleValidationError(error: unknown, fieldName: string): void {
        if (error instanceof ValidationError) {
            throw error
        }
        throw new ValidationError({
            [fieldName]: ['INVALID_IMAGE_FILE']
        })
    }
}