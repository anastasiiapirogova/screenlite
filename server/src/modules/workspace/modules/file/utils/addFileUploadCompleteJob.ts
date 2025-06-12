import { fileUploadQueue } from 'bullmq/queues/fileUploadQueue.js'

export const addFileUploadCompleteJob = async (fileUploadSessionId: string) => {
    await fileUploadQueue.add(
        'mergeFileParts',
        { fileUploadSessionId },
    )
}