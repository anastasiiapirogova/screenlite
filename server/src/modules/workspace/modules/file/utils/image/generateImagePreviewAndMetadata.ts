import fs from 'fs'
import path from 'path'
import { File } from '@generated/prisma/client.js'
import { generateImageMetadata } from './generateImageMetadata.js'
import { StorageService } from 'services/StorageService.js'

// For images, we do not generate a separate preview as we do for videos.
// The original image is used as the preview, and it can be resized later with getImageThumbnail for serving to the client.
// Note: This approach may need to be revised later based on performance considerations.
export const generateImagePreviewAndMetadata = async (file: File) => {
    const localFilePath = path.join(process.cwd(), 'tmp', file.path)

    try {
        await StorageService.storeFileLocally(file.path, localFilePath)
        await generateImageMetadata(file, localFilePath, file.path)
    } catch (error) {
        console.error(error)
    } finally {
        fs.unlinkSync(localFilePath)
    }
}