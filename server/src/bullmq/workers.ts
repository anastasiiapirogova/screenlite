import { deviceQueueWorker } from './workers/deviceQueueWorker.js'
import { fileQueueWorker } from './workers/fileQueueWorker.js'
import { fileUploadWorker } from './workers/fileUploadWorker.js'
import { playlistQueueWorker } from './workers/playlistQueueWorker.js'

export const closeWorkers = async () => {
    await Promise.all([
        deviceQueueWorker.close(),
        playlistQueueWorker.close(),
        fileUploadWorker.close(),
        fileQueueWorker.close()
    ])
}