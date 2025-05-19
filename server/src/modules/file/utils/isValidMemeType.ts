import { supportedMimeTypes } from './supportedMimeTypes.js'

export const isValidMimeType = (mimeType: string): boolean => {
    return supportedMimeTypes.includes(mimeType)
}