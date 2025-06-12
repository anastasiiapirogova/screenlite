import type { Prisma, PlaylistLayoutSection } from '@generated/prisma/client.js'
import { prisma } from '@config/prisma.js'

type PlaylistItemWithSection = Prisma.PlaylistItemGetPayload<{
    include: { playlistLayoutSection: true }
}>

export class PlaylistLayoutChangeService {
    private static async getPlaylistAndNewLayout(playlistId: string, newLayoutId: string) {
        const [playlist, newLayout] = await Promise.all([
            prisma.playlist.findUnique({
                where: { id: playlistId },
                include: {
                    layout: {
                        include: { sections: true }
                    },
                    items: {
                        include: { playlistLayoutSection: true }
                    }
                }
            }),
            prisma.playlistLayout.findUnique({
                where: { id: newLayoutId },
                include: { sections: true }
            })
        ])

        if (!playlist || !newLayout) {
            throw new Error('Playlist or new layout not found')
        }

        return { playlist, newLayout }
    }

    private static categorizeItems(
        items: PlaylistItemWithSection[],
        newLayoutSections: PlaylistLayoutSection[]
    ) {
        const itemsToKeep: (PlaylistItemWithSection & { playlistLayoutSectionId: string })[] = []
        const itemsToDelete: PlaylistItemWithSection[] = []

        items.forEach(item => {
            const sectionName = item.playlistLayoutSection.name
            const matchingNewSection = newLayoutSections.find(section => section.name === sectionName)
            
            if (matchingNewSection) {
                itemsToKeep.push({
                    ...item,
                    playlistLayoutSectionId: matchingNewSection.id
                })
            } else {
                itemsToDelete.push(item)
            }
        })

        return { itemsToKeep, itemsToDelete }
    }

    private static async updatePlaylistWithNewLayout(
        playlistId: string,
        newLayoutId: string,
        itemsToKeep: (PlaylistItemWithSection & { playlistLayoutSectionId: string })[],
        itemsToDelete: PlaylistItemWithSection[]
    ) {
        return await prisma.playlist.update({
            where: { id: playlistId },
            data: {
                playlistLayoutId: newLayoutId,
                items: {
                    deleteMany: {
                        id: {
                            in: itemsToDelete.map(item => item.id)
                        }
                    },
                    updateMany: itemsToKeep.map(item => ({
                        where: { id: item.id },
                        data: {
                            playlistLayoutSectionId: item.playlistLayoutSectionId
                        }
                    }))
                }
            },
            include: {
                layout: {
                    include: {
                        sections: true
                    }
                },
                _count: {
                    select: {
                        screens: true,
                        items: true
                    }
                }
            }
        })
    }

    static async changeLayout(playlistId: string, newLayoutId: string) {
        const { playlist, newLayout } = await this.getPlaylistAndNewLayout(playlistId, newLayoutId)
        const { itemsToKeep, itemsToDelete } = this.categorizeItems(playlist.items, newLayout.sections)

        return await this.updatePlaylistWithNewLayout(playlistId, newLayoutId, itemsToKeep, itemsToDelete)
    }
} 