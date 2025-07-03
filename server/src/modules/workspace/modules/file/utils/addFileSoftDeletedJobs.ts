import { addFileSoftDeletedJob } from './addFileSoftDeletedJob.ts'

export const addFileSoftDeletedJobs = async (fileIds: string[]) => {
    const jobs = fileIds.map((fileId) => addFileSoftDeletedJob(fileId))

    await Promise.allSettled(jobs)
} 