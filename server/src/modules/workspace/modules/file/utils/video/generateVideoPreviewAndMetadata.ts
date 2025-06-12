import fs from 'fs'
import path from 'path'
import { File } from '@generated/prisma/client.js'
import { generateVideoMetadata } from './generateVideoMetadata.js'
import { generateVideoPreview } from './generateVideoPreview.js'
import { v4 as uuid } from 'uuid'
import { StorageService } from '@services/StorageService.js'

export const generateVideoPreviewAndMetadata = async (file: File) => {
    const previewPath = `previews/${uuid()}.jpg`
    const tempPreviewPath = path.join(process.cwd(), 'tmp', previewPath)
    const localFilePath = path.join(process.cwd(), 'tmp', file.path)

    try {
        await StorageService.storeFileLocally(file.path, localFilePath)
        await generateVideoPreview(localFilePath, tempPreviewPath)

        const previewFile = fs.readFileSync(tempPreviewPath)

        await StorageService.uploadFile(previewPath, previewFile, 'image/jpeg')

        await generateVideoMetadata(file, localFilePath, previewPath)
    } catch (error) {
        console.error(error)
    } finally {
        fs.unlinkSync(localFilePath)
        fs.unlinkSync(tempPreviewPath)
    }
}