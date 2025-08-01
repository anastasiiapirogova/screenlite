import { CreatePlaylistLayoutRequestData, PlaylistLayout } from '../types'
import axios from '@config/axios'

type CreatePlaylistLayoutRequestResponse = {
    playlistLayout: PlaylistLayout
}

export const createPlaylistLayoutRequest = async (data: CreatePlaylistLayoutRequestData) => {
    const response = await axios.post<CreatePlaylistLayoutRequestResponse>(`/workspaces/${data.workspaceId}/playlistLayouts`, data)

    return response.data.playlistLayout
}