import { ComparablePlaylistItem } from '@/types.ts'
import { filterModifiedItems } from './getModifiedItems.ts'

const getDifference = (source: ComparablePlaylistItem[], target: ComparablePlaylistItem[]) =>
    source.filter(item => !target.some(targetItem => targetItem.id === item.id))

export const processPlaylistItems = (currentItems: ComparablePlaylistItem[], submittedItems: ComparablePlaylistItem[]) => {
    const itemsToDelete = getDifference(currentItems, submittedItems)
    const itemsToCreate = getDifference(submittedItems, currentItems)
    const itemsToUpdate = filterModifiedItems(currentItems, submittedItems)

    const itemsCount = itemsToDelete.length + itemsToCreate.length + itemsToUpdate.length

    return { itemsToDelete, itemsToCreate, itemsToUpdate, itemsCount }
}
