import { addFileForceDeletedJob } from './addFileForceDeletedJob.ts'

export const addFileForceDeletedJobs = async (fileIds: string[]) => {
    const jobs = fileIds.map((fileId) => addFileForceDeletedJob(fileId))

    await Promise.allSettled(jobs)
} 