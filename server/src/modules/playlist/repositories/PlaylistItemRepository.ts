import { PlaylistItemType } from '../types.ts'

export class PlaylistItemRepository {
    static TYPE: Record<string, PlaylistItemType> = {
        FILE: 'file',
        NESTED_PLAYLIST: 'nested_playlist',
        LINK: 'link'
    }
}