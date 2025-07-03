import axios from '@config/axios'
import { PlaylistContentManagerItem, PlaylistItem } from '@modules/workspace/modules/playlist/types'

export type UpdatePlaylistItemsRequestData = {
    playlistId: string
    workspaceId: string
    items: PlaylistContentManagerItem[]
}

export type UpdatePlaylistItemsRequestResponse = {
    items: PlaylistItem[]
}

export const updatePlaylistItemsRequest = async (data: UpdatePlaylistItemsRequestData) => {
    const response = await axios.put<UpdatePlaylistItemsRequestResponse>(`/workspaces/${data.workspaceId}/playlists/${data.playlistId}/items`, data)

    return response.data.items
}