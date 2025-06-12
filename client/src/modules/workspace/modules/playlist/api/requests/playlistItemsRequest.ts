import axios from '@config/axios.js'
import { PlaylistItem } from '../../types.js'

type PlaylistItemsRequestResponse = {
    items: PlaylistItem[]
}

export const playlistItemsRequest = async (id: string) => {
    const response = await axios.get<PlaylistItemsRequestResponse>(`/playlists/${id}/items`)

    return response.data.items
}