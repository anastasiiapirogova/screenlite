import { addPlaylistUpdatedJob } from '@modules/playlist/utils/addPlaylistUpdatedJob.js'
import { prisma } from '../config/prisma.js'
import { playlistLayoutEventEmitter } from '../events/eventEmitter.js'

const handle = async (playlistLayoutId: string) => {
    const playlists = await prisma.playlist.findMany({
        where: {
            playlistLayoutId,
            deletedAt: null,
            isPublished: true
        },
        select: {
            id: true
        }
    })

    playlists.forEach(playlist => {
        addPlaylistUpdatedJob(playlist.id)
    })
}

export const registerPlaylistLayoutUpdatedListener = () => {
    playlistLayoutEventEmitter.on('playlistLayoutUpdated', handle)
}