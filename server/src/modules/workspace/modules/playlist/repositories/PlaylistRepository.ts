import { prisma } from '@/config/prisma.js'
import { Playlist, Prisma } from '@/generated/prisma/client.js'
import { excludeFromArray } from '@/utils/exclude.js'
import { ComparablePlaylistItem } from '@/types.js'
import { CreatePlaylistData } from '../types.js'
import { CreateScheduleData } from '@workspaceModules/modules/playlistSchedule/types.js'
import { PlaylistLayoutChangeService } from '../services/PlaylistLayoutChangeService.js'

export class PlaylistRepository {
    static TYPE = {
        NESTABLE: 'nestable',
        STANDARD: 'standard',
    }

    static singularPlaylistIncludeClause: Prisma.PlaylistInclude = {
        layout: {
            include: {
                sections: true,
            }
        },
        schedules: true,
        _count: {
            select: {
                screens: true,
                items: true,
            }
        }
    }

    static async findManyById(ids: string[]) {
        return await prisma.playlist.findMany({
            where: {
                id: {
                    in: ids,
                },
            },
        })
    }

    static async deleteSchedule(playlistId: string, scheduleId: string) {
        return await prisma.playlist.update({
            where: {
                id: playlistId,
            },
            data: {
                schedules: {
                    delete: {
                        id: scheduleId,
                    },
                },
            },
            select: {
                id: true,
                deletedAt: true,
                isPublished: true,
                schedules: true,
            },
        })
    }

    static async createSchedule(id: string, data: CreateScheduleData) {
        return await prisma.playlist.update({
            where: {
                id,
            },
            data: {
                schedules: {
                    create: data,
                },
            },
            select: {
                id: true,
                deletedAt: true,
                isPublished: true,
                schedules: true,
            },
        })
    }

    static async findManyByIdEagerUser(ids: string[], userId: string) {
        return await prisma.playlist.findMany({
            where: {
                id: {
                    in: ids,
                },
            },
            include: {
                workspace: {
                    include: {
                        members: {
                            where: {
                                userId
                            }
                        }
                    }
                },
            },
        })
    }

    static async findManyDeletedByIdEagerUser(ids: string[], userId: string) {
        return await prisma.playlist.findMany({
            where: {
                id: {
                    in: ids,
                },
                deletedAt: {
                    not: null
                }
            },
            include: {
                workspace: {
                    include: {
                        members: {
                            where: {
                                userId
                            }
                        }
                    }
                },
            },
        })
    }

    static async create(data: CreatePlaylistData) {
        return await prisma.playlist.create({
            data,
            include: PlaylistRepository.singularPlaylistIncludeClause
        })
    }

    static async getPlaylistToCopy(id: string) {
        return prisma.playlist.findUnique({
            where: {
                id,
            },
            include: {
                items: true,
                schedules: true,
                screens: {
                    select: {
                        screenId: true
                    }
                },
            },
        })
    }

    static async getWithItems(id: string) {
        return await prisma.playlist.findUnique({
            where: { id },
            include: {
                items: true,
            },
        })
    }

    static async getWithExtendedItems(id: string) {
        return await prisma.playlist.findUnique({
            where: { id },
            select: {
                id: true,
                workspaceId: true,
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
                                        file: true,
                                    }
                                }
                            }
                        }
                    }
                },
            },
        })
    }

    static async getWithScreens(id: string) {
        return await prisma.playlist.findUnique({
            where: {
                id: id,
            },
            include: {
                screens: {
                    include: {
                        screen: {
                            include: {
                                device: {
                                    select: {
                                        id: true,
                                    }
                                }
                            }
                        }
                    }
                }
            },
        })
    }

    static async getPlaylistType(id: string, workspaceId?: string) {
        const playlist = await prisma.playlist.findUnique({
            where: {
                id: id,
                ...(workspaceId ? { workspaceId } : {})
            },
            select: {
                type: true
            }
        })

        return playlist
    }

    static async getPlaylist(id: string, workspaceId?: string) {
        const playlist = await prisma.playlist.findUnique({
            where: {
                id: id,
                ...(workspaceId ? { workspaceId } : {})
            },
            include: PlaylistRepository.singularPlaylistIncludeClause
        })

        // Prisma ORM do not support distinct count
        if(playlist && playlist.type === 'nestable') {
            const parentPlaylists = await prisma.$queryRaw<[{ count: number }]>`
                SELECT COUNT(DISTINCT "playlistId") as count
                FROM "PlaylistItem"
                WHERE "nestedPlaylistId" = ${playlist.id}
            `;

            (playlist._count as { items: number, screens: number, parentPlaylists?: number }).parentPlaylists = parentPlaylists[0].count
        }

        return playlist
    }

    static async getPlaylistWithoutRelationsById(id: string) {
        return await prisma.playlist.findUnique({
            where: {
                id: id,
            },
        })
    }

    static async updateLayout(id: string, layoutId: string) {
        return await prisma.playlist.update({
            where: {
                id: id,
            },
            data: {
                playlistLayoutId: layoutId,
                size: 0,
                items: {
                    deleteMany: {},
                },
            },
            include: PlaylistRepository.singularPlaylistIncludeClause
        })
    }

    static async updateLayoutPreservingItems(playlistId: string, newLayoutId: string) {
        return await PlaylistLayoutChangeService.changeLayout(playlistId, newLayoutId)
    }

    static async update(id: string, data: Partial<Playlist>) {
        return await prisma.playlist.update({
            where: {
                id: id,
            },
            data,
            include: PlaylistRepository.singularPlaylistIncludeClause
        })
    }

    static async addScreens(playlistId: string, screenIds: string[]) {
        return await prisma.playlist.update({
            where: {
                id: playlistId,
            },
            data: {
                screens: {
                    createMany: {
                        data: screenIds.map(screenId => ({ screenId: screenId })),
                        skipDuplicates: true
                    }
                },
            },
            include: {
                screens: {
                    include: {
                        screen: true
                    }
                },
            },
        })
    }

    static async removeScreens(playlistId: string, screenIds: string[]) {
        return await prisma.playlist.update({
            where: {
                id: playlistId,
            },
            data: {
                screens: {
                    deleteMany: {
                        screenId: {
                            in: screenIds
                        }
                    }
                },
            },
            include: {
                screens: {
                    include: {
                        screen: true
                    }
                },
            },
        })
    }

    static async updateItems(playlistId: string, itemsToDelete: ComparablePlaylistItem[], itemsToCreate: ComparablePlaylistItem[], itemsToUpdate: ComparablePlaylistItem[]) {
        return await prisma.playlist.update({
            where: { id: playlistId },
            include: {
                items: {
                    include: {
                        file: true,
                        nestedPlaylist: true
                    }
                }
            },
            data: {
                items: {
                    deleteMany: {
                        id: {
                            in: itemsToDelete.map(item => item.id)
                        }
                    },
                    create: excludeFromArray(itemsToCreate, ['id']),
                    updateMany: itemsToUpdate.map(item => ({
                        where: { id: item.id },
                        data: { duration: item.duration, order: item.order },
                    })),
                },
            },
        })
    }

    static async forceDeleteMany(ids: string[]) {
        return await prisma.playlist.deleteMany({
            where: {
                id: {
                    in: ids,
                },
            },
        })
    }
}