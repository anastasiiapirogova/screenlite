import { fileQueue } from '@/bullmq/queues/fileQueue.ts'

export const addFileForceDeletedJob = async (fileId: string) => {
    await fileQueue.add(
        'fileForceDeleted',
        { fileId: fileId },
        {
            deduplication: { id: `fileForceDeleted-${fileId}` },
        },
    )
} 