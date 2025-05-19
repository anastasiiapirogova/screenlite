import { PlaylistItem } from '@prisma/client'
import { ComparablePlaylistItem } from 'types.js'

export const mapPlaylistItemsToComparable = (items: PlaylistItem[]) => {
    return items.map(item => {
        return {
            id: item.id,
            playlistId: item.playlistId,
            type: item.type,
            duration: item.duration,
            playlistLayoutSectionId: item.playlistLayoutSectionId,
            fileId: item.fileId,
            nestedPlaylistId: item.nestedPlaylistId,
            order: item.order,
        } as ComparablePlaylistItem
    })
}