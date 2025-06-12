import { supportedMimeTypes } from '@config/files.js'

export const isValidMimeType = (mimeType: string): boolean => {
    return supportedMimeTypes.includes(mimeType)
}