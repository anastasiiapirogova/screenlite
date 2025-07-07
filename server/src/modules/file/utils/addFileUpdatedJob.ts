import { fileQueue } from '@/bullmq/queues/fileQueue.ts'

export const addFileUpdatedJob = async (fileId: string) => {
    await fileQueue.add(
        'fileUpdated',
        { fileId: fileId },
        {
            deduplication: { id: `fileUpdated-${fileId}` },
        },
    )
}