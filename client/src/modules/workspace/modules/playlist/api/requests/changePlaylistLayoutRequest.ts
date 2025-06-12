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
}

export const changePlaylistLayoutRequest = async (data: ChangePlaylistLayoutRequestData) => {
    const response = await axios.post<ChangePlaylistLayoutRequestResponse>('/playlists/changeLayout', data)

    return response.data.playlist
}