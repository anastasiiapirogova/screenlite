import { ComparablePlaylistItem } from '@/types.js'

export const fixOrderOfPlaylistItems = (items: ComparablePlaylistItem[]): ComparablePlaylistItem[] => {
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