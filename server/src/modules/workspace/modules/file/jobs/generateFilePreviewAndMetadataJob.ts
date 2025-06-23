import { prisma } from '@/config/prisma.js'
import { StorageService } from '@/services/storage/StorageService.js'
import { FileProcessingService } from '../services/FileProcessingService.js'
import { FileNotFoundError } from '@/services/storage/errors.js'

export const generateFilePreviewAndMetadataJob = async (fileId: string, attemptsMade: number) => {
    const file = await prisma.file.findFirst({
        where: { id: fileId }
    })

    if (!file) return

    const storageService = StorageService.getInstance()

    try {
        if(file.type === 'video') {
            const url = await storageService.getFileUrl(file.path)
            const metadata = await FileProcessingService.getVideoMetadata(url)
            const preview = await FileProcessingService.getVideoPreview(url)
            const previewPath = `previews/${file.id}.png`

            await storageService.uploadFile(previewPath, preview, 'image/png')

            await prisma.file.update({
                where: { id: fileId },
                data: {
                    ...metadata,
                    previewPath,
                    processingStatus: 'completed'
                }
            })
        } else if(file.type === 'image') {
            const readStream = await storageService.createReadStream(file.path)

            const metadata = await FileProcessingService.getImageMetadata(readStream)

            await prisma.file.update({
                where: { id: fileId },
                data: {
                    ...metadata,
                    processingStatus: 'completed'
                }
            })
        }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        if (error.code === 'NoSuchKey' || error.name === 'NoSuchKey' || error instanceof FileNotFoundError) {
            console.warn(`File not found in storage: ${file.path}. Deleting from database...`)
            await prisma.file.delete({
                where: { id: fileId }
            })
        } else {
            if(attemptsMade === 3) {
                await prisma.file.update({
                    where: { id: fileId },
                    data: {
                        processingStatus: 'failed'
                    }
                })
            }
            throw error
        }
    }
}
