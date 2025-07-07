import { addPlaylistUpdatedJob } from './addPlaylistUpdatedJob.ts'

export const addPlaylistUpdatedJobs = async (ids: string[], context: string) => {
    const jobs = ids.map((id) => addPlaylistUpdatedJob({ playlistId: id, context }))

    await Promise.allSettled(jobs)
}