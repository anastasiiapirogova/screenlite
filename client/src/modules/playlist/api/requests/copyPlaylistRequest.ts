import axios from '@config/axios'
import { GetPlaylistQueryData } from '../../types'

export type CopyPlaylistRequestData = {
    playlistId: string
    workspaceId: string
}

type CopyPlaylistRequestResponse = {
	playlist: GetPlaylistQueryData
}

export const copyPlaylistRequest = async (data: CopyPlaylistRequestData) => {
    const response = await axios.post<CopyPlaylistRequestResponse>(`/workspaces/${data.workspaceId}/playlists/${data.playlistId}/copy`)

    return response.data.playlist
}