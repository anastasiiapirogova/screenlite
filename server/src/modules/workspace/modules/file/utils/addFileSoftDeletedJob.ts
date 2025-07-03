import { fileQueue } from '@/bullmq/queues/fileQueue.ts'

export const addFileSoftDeletedJob = async (fileId: string) => {
    await fileQueue.add(
        'fileSoftDeleted',
        { fileId: fileId },
        {
            deduplication: { id: `fileSoftDeleted-${fileId}` },
        },
    )
} 