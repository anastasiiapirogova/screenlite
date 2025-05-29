import { PlaylistItemType } from '../types.js'

export class PlaylistItemRepository {
    static TYPE: Record<string, PlaylistItemType> = {
        FILE: 'file',
        NESTED_PLAYLIST: 'nested_playlist'
    }
}