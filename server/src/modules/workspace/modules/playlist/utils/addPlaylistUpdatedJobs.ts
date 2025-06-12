import { addPlaylistUpdatedJob } from './addPlaylistUpdatedJob.js'

export const addPlaylistUpdatedJobs = async (ids: string[]) => {
    const jobs = ids.map((id) => addPlaylistUpdatedJob({ playlistId: id }))

    await Promise.allSettled(jobs)
}