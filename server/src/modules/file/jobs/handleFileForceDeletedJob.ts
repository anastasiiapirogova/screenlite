import { prisma } from '@/config/prisma.ts'
import { StorageService } from '@/services/storage/StorageService.ts'

export const handleFileForceDeletedJob = async (fileId: string) => {
    const file = await prisma.file.findUnique({
        where: { id: fileId },
        select: {
            path: true,
            previewPath: true,
            forceDeleteRequestedAt: true
        }
    })

    if (!file || !file.forceDeleteRequestedAt) {
        return
    }

    const storageService = StorageService.getInstance()

    try {
        await storageService.deleteFile(file.path)

        if (file.previewPath) {
            try {
                await storageService.deleteFile(file.previewPath)
            } catch (error) {
                console.warn(`Failed to delete preview for file ${fileId}:`, error)
            }
        }

        await prisma.file.delete({
            where: { id: fileId }
        })
    } catch (error) {
        console.error(`Error force deleting file ${fileId}:`, error)
        throw error
    }
} 