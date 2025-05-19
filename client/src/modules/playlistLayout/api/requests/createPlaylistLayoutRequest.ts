import { CreatePlaylistLayoutRequestData, PlaylistLayout } from '@modules/playlistLayout/types'
import axios from '../../../../config/axios'

type CreatePlaylistLayoutRequestResponse = {
    playlistLayout: PlaylistLayout
}

export const createPlaylistLayoutRequest = async (data: CreatePlaylistLayoutRequestData) => {
    const response = await axios.post<CreatePlaylistLayoutRequestResponse>('/playlistLayouts/create', data)

    return response.data.playlistLayout
}