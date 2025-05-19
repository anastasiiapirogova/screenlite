import axios from '../../../../config/axios'
import { DeletePlaylistsRequestData } from '../../types'

type DeletePlaylistsRequestResponse = {
	playlistIds: string[]
}

export const deletePlaylistsRequest = async (data: DeletePlaylistsRequestData) => {
    const response = await axios.post<DeletePlaylistsRequestResponse>('/playlists/delete', data)

    return response.data.playlistIds
}