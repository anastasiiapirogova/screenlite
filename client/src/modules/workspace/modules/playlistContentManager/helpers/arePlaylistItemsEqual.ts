import { areItemsEqual } from '@shared/helpers/areItemsEqual.js'
import { PlaylistContentManagerItem } from '../../playlist/types.js'

const playlistComparableFields: (keyof PlaylistContentManagerItem)[] = ['type', 'duration', 'order', 'nestedPlaylistId', 'fileId']

export const arePlaylistItemsEqual = (a: PlaylistContentManagerItem[], b: PlaylistContentManagerItem[]) => {
    return areItemsEqual(a, b, playlistComparableFields)
}
