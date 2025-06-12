import { fileQueue } from 'bullmq/queues/fileQueue.js'

export const addGenerateFilePreviewAndMetadataJob = async (fileId: string) => {
    await fileQueue.add(
        'generateFilePreviewAndMetadata',
        { fileId: fileId },
        {
            deduplication: { id: `generateFilePreviewAndMetadata-${fileId}` },
        },
    )
}