import { prisma } from '@config/prisma.js'
import { generateVideoPreviewAndMetadata } from '../utils/video/generateVideoPreviewAndMetadata.js'
import { generateImagePreviewAndMetadata } from '../utils/image/generateImagePreviewAndMetadata.js'

export const generateFilePreviewAndMetadataJob = async (fileId: string) => {
    const file = await prisma.file.findFirst({
        where: {
            id: fileId
        }
    })

    if (!file) {
        return
    }

    switch (file.type) {
        case 'video':
            await generateVideoPreviewAndMetadata(file)
            break
        case 'image':
            await generateImagePreviewAndMetadata(file)
            break
        default:
            break
    }
}