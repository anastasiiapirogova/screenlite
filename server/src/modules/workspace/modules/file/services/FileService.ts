import { supportedMimeTypes } from '@/config/files.ts'

export class FileService {
    static isValidMimeType(mimeType: string): boolean {
        return supportedMimeTypes.includes(mimeType)
    }

    static shortenFileName(fileName: string, maxLength: number): string {
        const dotIndex = fileName.lastIndexOf('.')
        const nameWithoutExtension = dotIndex !== -1 ? fileName.slice(0, dotIndex) : fileName

        if (nameWithoutExtension.length <= maxLength) {
            return nameWithoutExtension
        }

        const shortenedName = nameWithoutExtension.slice(0, maxLength)

        return shortenedName
    }

    static sanitizeFileName(fileName: string): string {
        const maxLength = 255
        const extensionIndex = fileName.lastIndexOf('.')

        if (extensionIndex === -1) {
            return fileName.substring(0, maxLength)
        }

        const namePart = fileName.substring(0, extensionIndex)

        return namePart.substring(0, maxLength)
    }
}