import axios from '../../../../config/axios'
import { PlaylistLayoutPlaylist } from '../../types'

type PlaylistLayoutPlaylistRequestResponse = {
    playlists: PlaylistLayoutPlaylist[]
}

export const playlistLayoutPlaylistsRequest = async (id: string) => {
    const response = await axios.get<PlaylistLayoutPlaylistRequestResponse>(`/playlistLayouts/${id}/playlists`)

    return response.data.playlists
}