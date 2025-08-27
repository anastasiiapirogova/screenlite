import { ValidationError } from '@/shared/errors/validation.error.ts'

export class ImageFile {
    private constructor(
        public readonly key: string,
        public readonly mimeType: string,
        public readonly buffer: Buffer
    ) {}
  
    static create(key: string, mimeType: string, buffer: Buffer): ImageFile {
        this.validateKey(key)
        this.validateMimeType(mimeType)
        return new ImageFile(key, mimeType, buffer)
    }
  
    private static validateKey(key: string): void {
        if (!/^[a-zA-Z0-9_\-./]+$/.test(key) || key.includes('..') || key.length >= 512) {
            throw new ValidationError({ fileKey: ['INVALID_FILE_KEY'] })
        }
    }
  
    private static validateMimeType(mimeType: string): void {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']

        if (!allowedTypes.includes(mimeType)) {
            throw new ValidationError({ fileKey: ['UNSUPPORTED_FILE_TYPE'] })
        }
    }
}