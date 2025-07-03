import { prisma } from '@/config/prisma.ts'
import { PlaylistItem } from '@/generated/prisma/client.ts'
import { ComparablePlaylistItem } from '@/types.ts'

type ProcessedItems = {
    itemsToDelete: ComparablePlaylistItem[]
    itemsToCreate: ComparablePlaylistItem[]
    itemsToUpdate: ComparablePlaylistItem[]
    itemsCount: number
}

export class PlaylistItemsUpdateService {
    static async processItems(
        currentItems: PlaylistItem[],
        submittedItems: ComparablePlaylistItem[],
        workspaceId: string,
        playlistLayoutSectionIds: string[]
    ): Promise<ProcessedItems> {
        const currentComparable = this.mapToComparable(currentItems)
        const orderedSubmittedItems = this.updateItemsOrder(submittedItems)

        const itemsToDelete = this.getItemsToDelete(currentComparable, orderedSubmittedItems)
        const itemsToCreate = await this.getItemsToCreate(orderedSubmittedItems, currentComparable, workspaceId, playlistLayoutSectionIds)
        const itemsToUpdate = this.getItemsToUpdate(currentComparable, orderedSubmittedItems)

        const itemsCount = itemsToDelete.length + itemsToCreate.length + itemsToUpdate.length

        return {
            itemsToDelete,
            itemsToCreate,
            itemsToUpdate,
            itemsCount
        }
    }

    static async applyChanges(
        playlistId: string,
        processedItems: ProcessedItems
    ) {
        return await prisma.$transaction(async (tx) => {
            if (processedItems.itemsToDelete.length > 0) {
                await tx.playlistItem.deleteMany({
                    where: {
                        id: {
                            in: processedItems.itemsToDelete.map(item => item.id)
                        }
                    }
                })
            }

            if (processedItems.itemsToCreate.length > 0) {
                await tx.playlistItem.createMany({
                    data: processedItems.itemsToCreate.map(item => ({
                        type: item.type,
                        duration: item.duration,
                        playlistLayoutSectionId: item.playlistLayoutSectionId,
                        fileId: item.fileId,
                        nestedPlaylistId: item.nestedPlaylistId,
                        order: item.order,
                        playlistId: playlistId
                    }))
                })
            }

            if (processedItems.itemsToUpdate.length > 0) {
                for (const item of processedItems.itemsToUpdate) {
                    await tx.playlistItem.update({
                        where: { id: item.id },
                        data: { 
                            duration: item.duration, 
                            order: item.order 
                        }
                    })
                }
            }

            const updatedPlaylist = await tx.playlist.findUnique({
                where: { id: playlistId },
                include: {
                    items: true
                }
            })

            if (!updatedPlaylist) {
                throw new Error('Playlist not found after update')
            }

            return updatedPlaylist
        })
    }

    static mapToComparable(items: PlaylistItem[]): ComparablePlaylistItem[] {
        return items.map(item => ({
            id: item.id,
            playlistId: item.playlistId,
            type: item.type,
            duration: item.duration,
            playlistLayoutSectionId: item.playlistLayoutSectionId,
            fileId: item.fileId,
            nestedPlaylistId: item.nestedPlaylistId,
            order: item.order
        }))
    }

    static updateItemsOrder(items: ComparablePlaylistItem[]): ComparablePlaylistItem[] {
        const groupedItems = new Map<string, ComparablePlaylistItem[]>()

        for (const item of items) {
            const sectionId = item.playlistLayoutSectionId

            if (!groupedItems.has(sectionId)) {
                groupedItems.set(sectionId, [])
            }
            groupedItems.get(sectionId)!.push(item)
        }

        for (const group of groupedItems.values()) {
            group.sort((a, b) => a.order - b.order)
            for (let i = 0; i < group.length; i++) {
                group[i].order = i + 1
            }
        }

        return Array.from(groupedItems.values()).flat()
    }

    static getItemsToDelete(
        currentItems: ComparablePlaylistItem[],
        submittedItems: ComparablePlaylistItem[]
    ): ComparablePlaylistItem[] {
        return currentItems.filter(item => 
            !submittedItems.some(submittedItem => submittedItem.id === item.id)
        )
    }

    static async getItemsToCreate(
        submittedItems: ComparablePlaylistItem[],
        currentItems: ComparablePlaylistItem[],
        workspaceId: string,
        playlistLayoutSectionIds: string[]
    ): Promise<ComparablePlaylistItem[]> {
        const newItems = submittedItems.filter(item => 
            !currentItems.some(currentItem => currentItem.id === item.id)
        )

        if (newItems.length === 0) {
            return []
        }

        const validatedItems = await this.validateNewItems(newItems, workspaceId, playlistLayoutSectionIds)

        return validatedItems
    }

    static getItemsToUpdate(
        currentItems: ComparablePlaylistItem[],
        submittedItems: ComparablePlaylistItem[]
    ): ComparablePlaylistItem[] {
        const keysToCompare: (keyof ComparablePlaylistItem)[] = ['duration', 'order']
        const currentItemsMap = new Map<string, ComparablePlaylistItem>()

        for (const item of currentItems) {
            currentItemsMap.set(item.id, item)
        }

        const modifiedItems: ComparablePlaylistItem[] = []

        for (const submittedItem of submittedItems) {
            const currentItem = currentItemsMap.get(submittedItem.id)

            // Skip if the item doesn't exist in the playlist
            if (!currentItem) {
                continue
            }

            const isModified = keysToCompare.some(key => 
                currentItem[key] !== submittedItem[key]
            )

            if (isModified) {
                modifiedItems.push(submittedItem)
            }
        }

        return modifiedItems
    }

    static async validateNewItems(
        items: ComparablePlaylistItem[],
        workspaceId: string,
        playlistLayoutSectionIds: string[]
    ): Promise<ComparablePlaylistItem[]> {
        if (items.length === 0) {
            return []
        }

        const fileIds: string[] = []
        const nestedPlaylistIds: string[] = []
        const fileItems: ComparablePlaylistItem[] = []
        const nestedPlaylistItems: ComparablePlaylistItem[] = []

        for (const item of items) {
            if (item.fileId) {
                fileIds.push(item.fileId)
                fileItems.push(item)
            } else if (item.nestedPlaylistId) {
                nestedPlaylistIds.push(item.nestedPlaylistId)
                nestedPlaylistItems.push(item)
            }
        }

        if (fileIds.length === 0 && nestedPlaylistIds.length === 0) {
            return []
        }

        const workspace = await prisma.workspace.findUnique({
            where: { id: workspaceId },
            select: {
                files: { 
                    where: { id: { in: fileIds } }, 
                    select: { id: true } 
                },
                playlists: { 
                    where: { 
                        id: { in: nestedPlaylistIds }, 
                        type: 'nestable' 
                    }, 
                    select: { id: true } 
                }
            }
        })

        if (!workspace) {
            throw new Error('Workspace not found')
        }

        const validFileIds = new Set(workspace.files.map(file => file.id))
        const validNestedPlaylistIds = new Set(workspace.playlists.map(playlist => playlist.id))
        const playlistLayoutSectionIdsSet = new Set(playlistLayoutSectionIds)

        const validFileItems = fileItems.filter(item => 
            validFileIds.has(item.fileId!) && playlistLayoutSectionIdsSet.has(item.playlistLayoutSectionId)
        )
        const validNestedPlaylistItems = nestedPlaylistItems.filter(item => 
            validNestedPlaylistIds.has(item.nestedPlaylistId!) && playlistLayoutSectionIdsSet.has(item.playlistLayoutSectionId)
        )

        return [...validFileItems, ...validNestedPlaylistItems]
    }
} 