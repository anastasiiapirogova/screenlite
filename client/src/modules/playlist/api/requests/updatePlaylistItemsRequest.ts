import axios from '@config/axios'
import { PlaylistContentManagerItem, PlaylistItem } from '@modules/playlist/types'

export type UpdatePlaylistItemsRequestData = {
    playlistId: string
    items: PlaylistContentManagerItem[]
}

export type UpdatePlaylistItemsRequestResponse = {
    items: PlaylistItem[]
}

export const updatePlaylistItemsRequest = async (data: UpdatePlaylistItemsRequestData) => {
    const response = await axios.post<UpdatePlaylistItemsRequestResponse>('/playlists/updateItems', data)

    return response.data.items
}