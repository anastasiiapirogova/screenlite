import { ComparablePlaylistItem } from 'types.js'

const keysToCompare: (keyof ComparablePlaylistItem)[] = [
    'duration',
    'order'
]

export const filterModifiedItems = (
    currentItems: ComparablePlaylistItem[],
    providedItems: ComparablePlaylistItem[],
): ComparablePlaylistItem[] => {
    const currentItemsMap = new Map<string, ComparablePlaylistItem>()

    for (const item of currentItems) {
        currentItemsMap.set(item.id, item)
    }

    const modifiedItems: ComparablePlaylistItem[] = []

    for (const providedItem of providedItems) {
        const currentItem = currentItemsMap.get(providedItem.id)

        if (!currentItem) {
            modifiedItems.push(providedItem)
            continue
        }

        const isModified = keysToCompare.some((key) => currentItem[key] !== providedItem[key])

        if (isModified) {
            modifiedItems.push(providedItem)
        }
    }

    return modifiedItems
}