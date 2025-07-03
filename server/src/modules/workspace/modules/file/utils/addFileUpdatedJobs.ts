import { addFileUpdatedJob } from './addFileUpdatedJob.ts'

export const addFileUpdatedJobs = async (fileIds: string[]) => {
    const jobs = fileIds.map((fileId) => addFileUpdatedJob(fileId))

    await Promise.allSettled(jobs)
} 