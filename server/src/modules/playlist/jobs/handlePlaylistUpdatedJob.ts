import { prisma } from '@/config/prisma.ts'
import { DeviceJobProducer } from '@/bullmq/producers/DeviceJobProducer.ts'
import { PlaylistJobProducer } from '@/bullmq/producers/PlaylistJobProducer.ts'
import { PlaylistRepository } from '../repositories/PlaylistRepository.ts'

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

    await PlaylistJobProducer.queuePlaylistUpdatedJobs(playlistIds, 'playlist updated (cascade)')
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

    const jobs = devices.map(device => 
        DeviceJobProducer.queueSendNewStateToDeviceJob(device.token)
    )

    await Promise.all(jobs)
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