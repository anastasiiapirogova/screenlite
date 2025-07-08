import axios from '@config/axios'
import { RestorePlaylistsRequestData } from '../../types'

type RestorePlaylistsRequestResponse = {
	playlistIds: string[]
}

export const restorePlaylistsRequest = async (data: RestorePlaylistsRequestData) => {
    const response = await axios.post<RestorePlaylistsRequestResponse>(`/workspaces/${data.workspaceId}/playlists/restore`, data)

    return response.data.playlistIds
}