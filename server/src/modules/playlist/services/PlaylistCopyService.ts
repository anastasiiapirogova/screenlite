import { prisma } from '@/config/prisma.ts'
import { exclude } from '@/utils/exclude.ts'
import { PlaylistRepository } from '../repositories/PlaylistRepository.ts'

type PlaylistWithRelations = NonNullable<Awaited<ReturnType<typeof PlaylistRepository.getPlaylistToCopy>>>

export class PlaylistCopyService {
    private static getBasePlaylistData(playlist: PlaylistWithRelations) {
        return {
            name: playlist.name,
            workspaceId: playlist.workspaceId,
            description: playlist.description,
            type: playlist.type,
            priority: playlist.priority,
            playlistLayoutId: playlist.playlistLayoutId,
            isPublished: false
        }
    }

    private static getScreensData(playlist: PlaylistWithRelations) {
        return playlist.screens.map(screen => ({ screenId: screen.screenId }))
    }

    private static getSchedulesData(playlist: PlaylistWithRelations) {
        return playlist.schedules.map(schedule => ({
            startAt: schedule.startAt,
            endAt: schedule.endAt,
            startTime: schedule.startTime,
            endTime: schedule.endTime,
            weekdays: schedule.weekdays
        }))
    }

    private static getItemsData(playlist: PlaylistWithRelations) {
        return playlist.items.map(item => ({
            type: item.type,
            duration: item.duration,
            playlistLayoutSectionId: item.playlistLayoutSectionId,
            fileId: item.fileId,
            nestedPlaylistId: item.nestedPlaylistId,
            order: item.order
        }))
    }

    private static async createPlaylistWithRelations(
        baseData: ReturnType<typeof PlaylistCopyService.getBasePlaylistData>,
        screens: ReturnType<typeof PlaylistCopyService.getScreensData>,
        schedules: ReturnType<typeof PlaylistCopyService.getSchedulesData>,
        items: ReturnType<typeof PlaylistCopyService.getItemsData>
    ) {
        return await prisma.playlist.create({
            data: {
                ...baseData,
                screens: {
                    create: screens
                },
                schedules: {
                    create: schedules
                },
                items: {
                    create: items
                }
            },
            include: PlaylistRepository.singularPlaylistIncludeClause
        })
    }

    static async copyPlaylist(playlist: PlaylistWithRelations) {
        const baseData = this.getBasePlaylistData(playlist)
        const screensData = this.getScreensData(playlist)
        const schedulesData = this.getSchedulesData(playlist)
        const itemsData = this.getItemsData(playlist)

        const newPlaylist = await this.createPlaylistWithRelations(
            baseData,
            screensData,
            schedulesData,
            itemsData
        )

        return exclude(newPlaylist, ['playlistLayoutId'])
    }
} 