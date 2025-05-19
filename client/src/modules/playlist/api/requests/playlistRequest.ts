import axios from '../../../../config/axios'
import { Playlist, PlaylistSchedule } from '../../types'

type PlaylistRequestResponse = {
	playlist: Playlist & {
		schedules: PlaylistSchedule[]
	}
}

export const playlistRequest = async (id: string) => {
    const response = await axios.get<PlaylistRequestResponse>(`/playlists/${id}`)

    return response.data.playlist
}