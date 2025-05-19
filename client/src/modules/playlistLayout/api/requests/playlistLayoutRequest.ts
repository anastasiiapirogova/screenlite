import axios from '../../../../config/axios'
import { PlaylistLayout } from '../../types'

type PlaylistLayoutRequestResponse = {
    playlistLayout: PlaylistLayout
}

export const playlistLayoutRequest = async (id: string) => {
    const response = await axios.get<PlaylistLayoutRequestResponse>(`/playlistLayouts/${id}`)

    return response.data.playlistLayout
}