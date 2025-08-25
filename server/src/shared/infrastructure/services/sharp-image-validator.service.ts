import sharp from 'sharp'
import { IImageValidator } from '@/core/ports/image-validator.interface.ts'
import { ValidationError } from '@/shared/errors/validation.error.ts'

export class SharpImageValidator implements IImageValidator {
    async validateProfilePicture(buffer: Buffer): Promise<void> {
        try {
            const metadata = await sharp(buffer).metadata()

            if (!['jpeg', 'png', 'jpg', 'webp'].includes(metadata.format || '')) {
                throw new ValidationError({
                    profilePicture: ['UNSUPPORTED_IMAGE_FORMAT'],
                })
            }

            if ((metadata.width ?? 0) > 10000 || (metadata.height ?? 0) > 10000) {
                throw new ValidationError({
                    profilePicture: ['IMAGE_TOO_LARGE'],
                })
            }

            if ((metadata.width ?? 0) < 1 || (metadata.height ?? 0) < 1) {
                throw new ValidationError({
                    profilePicture: ['INVALID_IMAGE_DIMENSIONS'],
                })
            }
        } catch (error) {
            if (error instanceof ValidationError) {
                throw error
            }
            throw new ValidationError({
                profilePicture: ['INVALID_IMAGE_FILE'],
            })
        }
    }
}