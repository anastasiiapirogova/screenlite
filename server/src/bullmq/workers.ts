import { deviceQueueWorker } from './workers/deviceQueueWorker.ts'
import { fileQueueWorker } from './workers/fileQueueWorker.ts'
import { fileUploadWorker } from './workers/fileUploadWorker.ts'
import { playlistQueueWorker } from './workers/playlistQueueWorker.ts'

export const closeWorkers = async () => {
    await Promise.all([
        deviceQueueWorker.close(),
        playlistQueueWorker.close(),
        fileUploadWorker.close(),
        fileQueueWorker.close()
    ])
}