import { WorkspaceFile } from '@modules/file/types'
import { v4 as uuidv4 } from 'uuid'
import { PlaylistContentManagerItem } from '../../playlist/types.js'

export const mapFileToPlaylistItem = (files: WorkspaceFile[], sectionId: string, maxOrder: number) => {
    return files.map((item, index) => ({
        id: uuidv4(),
        playlistLayoutSectionId: sectionId,
        order: maxOrder + index + 1,
        fileId: item.id,
        file: item,
        type: 'File',
        duration: item.duration || 15,
        nestedPlaylistId: null,
        nestedPlaylist: null
    } as PlaylistContentManagerItem))
}