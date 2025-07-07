import { getDeviceSocketConnectionByToken } from '@/controllers/socket.ts'
import { prisma } from '@/config/prisma.ts'

const getDeviceWithScreen = async (token: string) => {
    return await prisma.device.findUnique({
        where: { token },
        include: {
            screen: {
                include: {
                    workspace: true
                }
            }
        }
    })
}

const getPublishedPlaylists = async (screenId: string) => {
    return await prisma.playlistScreen.findMany({
        where: {
            screenId,
            playlist: {
                deletedAt: null,
                playlistLayoutId: {
                    not: null
                },
                isPublished: true
            }
        },
        select: {
            playlist: {
                include: {
                    layout: {
                        include: {
                            sections: true
                        }
                    },
                    schedules: true
                }
            }
        }
    })
}

const getPlaylistItems = async (playlistId: string) => {
    return await prisma.playlistItem.findMany({
        where: {
            playlistId
        },
        include: {
            file: {
                where: {
                    deletedAt: null
                }
            },
            nestedPlaylist: {
                where: {
                    deletedAt: null
                },
                include: {
                    layout: {
                        include: {
                            sections: true
                        }
                    },
                    items: {
                        include: {
                            file: {
                                where: {
                                    deletedAt: null
                                }
                            }
                        }
                    }
                }
            }
        }
    })
}

const enrichPlaylistsWithItems = async (playlists: Array<{ playlist: { id: string } }>) => {
    const enrichedPlaylists = await Promise.all(
        playlists.map(async (playlistScreen) => {
            const items = await getPlaylistItems(playlistScreen.playlist.id)

            return {
                ...playlistScreen.playlist,
                items
            }
        })
    )

    return enrichedPlaylists
}

export const sendNewStateToDeviceJob = async (token: string) => {
    const deviceSocket = await getDeviceSocketConnectionByToken(token)

    if (!deviceSocket) return

    const device = await getDeviceWithScreen(token)

    if (!device) return

    const playlistScreens = await getPublishedPlaylists(device.screen!.id)
    const enrichedPlaylists = await enrichPlaylistsWithItems(playlistScreens)

    deviceSocket.emit('deviceState', { 
        ...device, 
        screen: { 
            ...device.screen, 
            playlists: enrichedPlaylists 
        } 
    })
}
