import axios from '../../../../config/axios'
import { CreatePlaylistRequestData, GetPlaylistQueryData } from '../../types'

type CreatePlaylistRequestResponse = {
	playlist: GetPlaylistQueryData
}

export const createPlaylistRequest = async (data: CreatePlaylistRequestData) => {
    const response = await axios.post<CreatePlaylistRequestResponse>('/playlists/create', data)

    return response.data.playlist
}