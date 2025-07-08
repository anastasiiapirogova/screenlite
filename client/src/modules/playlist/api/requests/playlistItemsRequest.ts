import axios from '@config/axios.js'
import { PlaylistItem } from '../../types.js'

type PlaylistItemsRequestResponse = {
    items: PlaylistItem[]
}

export type PlaylistItemsRequestData = {
    playlistId: string
    workspaceId: string
}

export const playlistItemsRequest = async (data: PlaylistItemsRequestData) => {
    const response = await axios.get<PlaylistItemsRequestResponse>(`/workspaces/${data.workspaceId}/playlists/${data.playlistId}/items`)

    return response.data.items
}

export const playlistItemsQuery = (data: PlaylistItemsRequestData) => ({
    queryKey: ['playlistItems', data],
    queryFn: async () => playlistItemsRequest(data),
})