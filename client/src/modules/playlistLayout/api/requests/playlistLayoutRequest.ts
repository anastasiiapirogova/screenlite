import axios from '@config/axios'
import { PlaylistLayout } from '../../types'

export type PlaylistLayoutRequestData = {
    playlistLayoutId: string
    workspaceId: string
}

type PlaylistLayoutRequestResponse = {
    playlistLayout: PlaylistLayout
}

export const playlistLayoutRequest = async (data: PlaylistLayoutRequestData) => {
    const response = await axios.get<PlaylistLayoutRequestResponse>(`/workspaces/${data.workspaceId}/playlistLayouts/${data.playlistLayoutId}`)

    return response.data.playlistLayout
}

export const playlistLayoutQuery = (data: PlaylistLayoutRequestData) => ({
    queryKey: ['playlistLayout', data],
    queryFn: async () => playlistLayoutRequest(data)
})