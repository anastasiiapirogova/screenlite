import { prisma } from '@/config/prisma.ts'
import { PlaylistItem } from '@/generated/prisma/client.ts'
import { ComparablePlaylistItem } from '@/types.ts'

export class UpdatePlaylistItemsService {
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

    private static getDifference(source: ComparablePlaylistItem[], target: ComparablePlaylistItem[]) {
        return source.filter(item => !target.some(targetItem => targetItem.id === item.id))
    }

    private static filterModifiedItems(currentItems: ComparablePlaylistItem[], providedItems: ComparablePlaylistItem[]): ComparablePlaylistItem[] {
        const keysToCompare: (keyof ComparablePlaylistItem)[] = ['duration', 'order']

        const currentItemsMap = new Map<string, ComparablePlaylistItem>()

        for (const item of currentItems) currentItemsMap.set(item.id, item)

        const modifiedItems: ComparablePlaylistItem[] = []

        for (const providedItem of providedItems) {
            const currentItem = currentItemsMap.get(providedItem.id)

            if (!currentItem) {
                modifiedItems.push(providedItem)
                continue
            }
            const isModified = keysToCompare.some(key => currentItem[key] !== providedItem[key])

            if (isModified) modifiedItems.push(providedItem)
        }

        return modifiedItems
    }

    static async processItems({
        currentItems,
        submittedItems,
        workspaceId
    }: {
        currentItems: ComparablePlaylistItem[]
        submittedItems: ComparablePlaylistItem[]
        workspaceId: string
    }) {
        const itemsToDelete = this.getDifference(currentItems, submittedItems)
        const itemsToCreate = this.getDifference(submittedItems, currentItems)
        const itemsToUpdate = this.filterModifiedItems(currentItems, submittedItems)
        const itemsCount = itemsToDelete.length + itemsToCreate.length + itemsToUpdate.length
        const processedItemsToCreate = await this.processItemsToCreate(itemsToCreate, workspaceId)

        return { itemsToDelete, itemsToCreate: processedItemsToCreate, itemsToUpdate, itemsCount }
    }

    private static async processItemsToCreate(items: ComparablePlaylistItem[], workspaceId: string): Promise<ComparablePlaylistItem[]> {
        const fileTypeItems = items.filter(item => item.fileId) as (ComparablePlaylistItem & { fileId: string })[]
        const nestedPlaylistTypeItems = items.filter(item => item.nestedPlaylistId) as (ComparablePlaylistItem & { nestedPlaylistId: string })[]

        const workspace = await prisma.workspace.findUnique({
            where: { id: workspaceId },
            select: {
                files: { where: { id: { in: fileTypeItems.map(item => item.fileId) } }, select: { id: true } },
                playlists: { where: { id: { in: nestedPlaylistTypeItems.map(item => item.nestedPlaylistId) }, type: 'nestable' }, select: { id: true } }
            }
        })

        if (!workspace) throw new Error('Workspace not found')

        const files = workspace.files
        const playlists = workspace.playlists

        const validFileTypeItems = fileTypeItems.filter(item => files.some(file => file.id === item.fileId))
        const validNestedPlaylistTypeItems = nestedPlaylistTypeItems.filter(item => playlists.some(playlist => playlist.id === item.nestedPlaylistId))

        return [...validFileTypeItems, ...validNestedPlaylistTypeItems]
    }
} 