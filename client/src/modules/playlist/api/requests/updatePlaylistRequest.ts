import axios from '../../../../config/axios.js'
import { Playlist, PlaylistSchedule } from '../../types.js'

type UpdatePlaylistRequestResponse = {
	playlist: Playlist & {
		schedules: PlaylistSchedule[]
	}
}

export type UpdatePlaylistRequestData = {
	playlistId: string,
	name?: string,
	description?: string,
	isPublished?: boolean,
	priority?: number,
}

export const updatePlaylistRequest = async (data: UpdatePlaylistRequestData) => {
    const response = await axios.post<UpdatePlaylistRequestResponse>('/playlists/update', data)

    return response.data.playlist
}