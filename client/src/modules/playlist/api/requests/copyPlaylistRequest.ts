import axios from '../../../../config/axios'
import { GetPlaylistQueryData } from '../../types'

export type CopyPlaylistRequestData = {
    playlistId: string
}

type CopyPlaylistRequestResponse = {
	playlist: GetPlaylistQueryData
}

export const copyPlaylistRequest = async (data: CopyPlaylistRequestData) => {
    const response = await axios.post<CopyPlaylistRequestResponse>('/playlists/copy', data)

    return response.data.playlist
}