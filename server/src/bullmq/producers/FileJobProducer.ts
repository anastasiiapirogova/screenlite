import { fileQueue } from '@/bullmq/queues/fileQueue.ts'

export class FileJobProducer {
    static async queueFileForceDeletedJob(fileId: string): Promise<void> {
        await fileQueue.add(
            'fileForceDeleted',
            { fileId },
            {
                deduplication: { id: `fileForceDeleted-${fileId}` },
            }
        )
    }

    static async queueFileForceDeletedJobs(fileIds: string[]): Promise<void> {
        const jobs = fileIds.map((fileId) => this.queueFileForceDeletedJob(fileId))

        await Promise.all(jobs)
    }

    static async queueGenerateFilePreviewAndMetadataJob(fileId: string): Promise<void> {
        await fileQueue.add(
            'generateFilePreviewAndMetadata',
            { fileId },
            {
                deduplication: { id: `generateFilePreviewAndMetadata-${fileId}` },
            }
        )
    }

    static async queueFileUpdatedJob(fileId: string): Promise<void> {
        await fileQueue.add(
            'fileUpdated',
            { fileId },
            {
                deduplication: { id: `fileUpdated-${fileId}` },
            }
        )
    }

    static async queueFileUpdatedJobs(fileIds: string[]): Promise<void> {
        const jobs = fileIds.map((fileId) => this.queueFileUpdatedJob(fileId))

        await Promise.all(jobs)
    }
} 