import axios from '@config/axios'
import { PlaylistLayoutPlaylist } from '../../types'

export type PlaylistLayoutPlaylistsRequestData = {
    playlistLayoutId: string
    workspaceId: string
}

type PlaylistLayoutPlaylistRequestResponse = {
    playlists: PlaylistLayoutPlaylist[]
}

export const playlistLayoutPlaylistsRequest = async (data: PlaylistLayoutPlaylistsRequestData) => {
    const response = await axios.get<PlaylistLayoutPlaylistRequestResponse>(`/workspaces/${data.workspaceId}/playlistLayouts/${data.playlistLayoutId}/playlists`)

    return response.data.playlists
}

export const playlistLayoutPlaylistsQuery = (data: PlaylistLayoutPlaylistsRequestData) => ({
    queryKey: ['playlistLayoutPlaylists', data],
    queryFn: async () => playlistLayoutPlaylistsRequest(data)
})