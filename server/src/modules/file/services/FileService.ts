import { supportedMimeTypes } from '@/config/files.ts'

export class FileService {
    static isValidMimeType(mimeType: string): boolean {
        return supportedMimeTypes.includes(mimeType)
    }

    static shortenFileName(fileName: string, maxLength: number): string {
        const dotIndex = fileName.lastIndexOf('.')
        const nameWithoutExtension = dotIndex !== -1 ? fileName.slice(0, dotIndex) : fileName
        const extension = dotIndex !== -1 ? fileName.slice(dotIndex) : ''

        if (nameWithoutExtension.length <= maxLength) {
            return fileName
        }

        const shortenedName = nameWithoutExtension.slice(0, maxLength) + extension

        return shortenedName
    }
}