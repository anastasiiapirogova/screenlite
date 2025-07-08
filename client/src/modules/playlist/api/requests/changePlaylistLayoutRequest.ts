import axios from '@config/axios.js'
import { Playlist, PlaylistSchedule } from '../../types.js'

type ChangePlaylistLayoutRequestResponse = {
	playlist: Playlist & {
		schedules: PlaylistSchedule[]
	}
}

export type ChangePlaylistLayoutRequestData = {
	playlistId: string,
	playlistLayoutId: string,
	workspaceId: string
}

export const changePlaylistLayoutRequest = async (data: ChangePlaylistLayoutRequestData) => {
    const response = await axios.put<ChangePlaylistLayoutRequestResponse>(`/workspaces/${data.workspaceId}/playlists/${data.playlistId}/layout`, data)

    return response.data.playlist
}