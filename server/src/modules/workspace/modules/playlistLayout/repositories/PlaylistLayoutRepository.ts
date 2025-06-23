import { prisma } from '@/config/prisma.js'
import { Prisma } from '@/generated/prisma/client.js'

type CreateLayoutData = {
    workspaceId: string
    name: string
    resolutionHeight: number
    resolutionWidth: number
}

export class PlaylistLayoutRepository {
    static async existsInWorkspace(playlistId: string, workspaceId: string) {
        return await prisma.playlistLayout.count({
            where: {
                id: playlistId,
                workspaceId
            }
        }) > 0
    }

    static findInWorkspace(playlistId: string, workspaceId: string) {
        return prisma.playlistLayout.findFirst({
            where: {
                id: playlistId,
                workspaceId
            }
        })
    }

    static createLayout(data: CreateLayoutData) {
        const { workspaceId, name, resolutionHeight, resolutionWidth } = data

        return prisma.playlistLayout.create({
            data: {
                name,
                workspaceId,
                resolutionHeight,
                resolutionWidth,
                sections: {
                    create: {
                        name: 'Main',
                        top: 0,
                        left: 0,
                        width: resolutionWidth,
                        height: resolutionHeight,
                        zIndex: 0,
                    }
                }
            },
            include: {
                sections: true,
                _count: {
                    select: {
                        playlists: {
                            where: {
                                deletedAt: null
                            }
                        }
                    }
                }
            }
        })
    }

    static find(id: string) {
        return prisma.playlistLayout.findUnique({
            where: {
                id,
            },
            include: {
                sections: true,
                _count: {
                    select: {
                        playlists: {
                            where: {
                                deletedAt: null
                            }
                        }
                    }
                }
            }
        })
    }

    static getWithSections(id: string, workspaceId?: string ) {
        return prisma.playlistLayout.findFirst({
            where: {
                id: id,
                workspaceId: workspaceId ?? Prisma.skip
            },
            include: {
                sections: true,
            }
        })
    }

    static getWithPlaylistIds(id: string) {
        return prisma.playlistLayout.findFirst({
            where: {
                id: id,
            },
            include: {
                playlists: {
                    select: {
                        id: true
                    }
                }
            }
        })
    }

    static update(id: string, data: Prisma.PlaylistLayoutUpdateInput) {
        return prisma.playlistLayout.update({
            where: {
                id,
            },
            data,
            include: {
                sections: true,
                _count: {
                    select: {
                        playlists: true,
                    },
                }
            },
        })
    }
}