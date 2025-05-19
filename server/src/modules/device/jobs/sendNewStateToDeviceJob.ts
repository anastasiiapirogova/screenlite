import { getDeviceSocketConnectionByToken } from 'controllers/socket.js'
import { prisma } from '@config/prisma.js'

export const sendNewStateToDeviceJob = async (token: string) => {
    const deviceSocket = await getDeviceSocketConnectionByToken(token)

    if (!deviceSocket) return

    const device = await prisma.device.findUnique({
        where: {
            token
        },
        include: {
            screen: {
                include: {
                    workspace: true,
                    playlists: {
                        where: {
                            playlist: {
                                deletedAt: null,
                                layout: {
                                    isNot: null
                                },
                                isPublished: true
                            },
                        },
                        select: {
                            playlist: {
                                include: {
                                    items: {
                                        include: {
                                            file: true,
                                            nestedPlaylist: {
                                                include: {
                                                    layout: {
                                                        include: {
                                                            sections: true
                                                        }  
                                                    },
                                                    items: {
                                                        include: {
                                                            file: true
                                                        }
                                                    }
                                                }
                                            }
                                        },
                                    },
                                    layout: {
                                        include: {
                                            sections: true
                                        }
                                    }
                                }
                            },
                        }
                    }
                }
            }
        }
    })

    if(!device) return

    const playlists = device.screen?.playlists.map(p => p.playlist)

    deviceSocket.emit('deviceState', { ...device, screen: { ...device?.screen, playlists } })
}
