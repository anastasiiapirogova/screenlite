import axios from '@config/axios.js'
import { Playlist, PlaylistSchedule } from '../../types.js'

type UpdatePlaylistRequestResponse = {
	playlist: Playlist & {
		schedules: PlaylistSchedule[]
	}
}

export type UpdatePlaylistRequestData = {
	workspaceId: string,
	playlistId: string,
	name?: string,
	description?: string,
	isPublished?: boolean,
	priority?: number,
}

export const updatePlaylistRequest = async (data: UpdatePlaylistRequestData) => {
    const response = await axios.patch<UpdatePlaylistRequestResponse>(`/workspaces/${data.workspaceId}/playlists/${data.playlistId}`, data)

    return response.data.playlist
}