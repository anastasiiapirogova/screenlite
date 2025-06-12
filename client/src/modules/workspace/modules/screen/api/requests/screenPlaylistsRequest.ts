import { Playlist } from '@modules/workspace/modules/playlist/types'
import axios from '@config/axios'

type ScreenPlaylistsRequestResponse = {
	playlists: Playlist[]
}

export const screenPlaylistsRequest = async (id: string) => {
    const response = await axios.get<ScreenPlaylistsRequestResponse>(`/screens/${id}/playlists`)

    return response.data.playlists
}