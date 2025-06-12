import { prisma } from '@config/prisma.js'
import { addSendNewStateToDeviceJob } from '@modules/device/utils/addSendNewStateToDeviceJob.js'
import { addPlaylistUpdatedJobs } from '../utils/addPlaylistUpdatedJobs.js'
import { PlaylistRepository } from '../repositories/PlaylistRepository.js'

const handleUpdateNestablePlaylist = async (playlistId: string) => {
    const parentPlaylists = await prisma.playlistItem.findMany({
        where: {
            nestedPlaylistId: playlistId,
            playlist: {
                deletedAt: null,
                isPublished: true,
            }
        },
        select: {
            playlist: {
                select: {
                    id: true
                }
            }
        }
    })

    const playlistIds = [...new Set(parentPlaylists.map(item => item.playlist.id))]

    addPlaylistUpdatedJobs(playlistIds)
}

const handleUpdateStandardPlaylist = async (playlistId: string) => {
    const devices = await prisma.device.findMany({
        where: {
            screen: {
                playlists: {
                    some: {
                        playlistId
                    }
                }
            }
        },
        select: {
            token: true
        }
    })

    devices.forEach(device => {
        addSendNewStateToDeviceJob(device.token)
    })
}

export const handlePlaylistUpdatedJob = async (playlistId: string) => {
    const playlist = await prisma.playlist.findUnique({
        where: {
            id: playlistId
        },
        select: {
            type: true,
        }
    })

    if (!playlist) {
        return
    }

    if(playlist.type === PlaylistRepository.TYPE.NESTABLE) {
        await handleUpdateNestablePlaylist(playlistId)
    }

    if(playlist.type === PlaylistRepository.TYPE.STANDARD) {
        await handleUpdateStandardPlaylist(playlistId)
    }
}