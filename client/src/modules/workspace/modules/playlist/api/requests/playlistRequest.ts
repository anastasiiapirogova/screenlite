import axios from '@config/axios'
import { Playlist, PlaylistSchedule } from '../../types'

export type PlaylistRequestData = {
    playlistId: string
    workspaceId: string
}

type PlaylistRequestResponse = {
	playlist: Playlist & {
		schedules: PlaylistSchedule[]
	}
}

export const playlistRequest = async (data: PlaylistRequestData) => {
    const response = await axios.get<PlaylistRequestResponse>(`/workspaces/${data.workspaceId}/playlists/${data.playlistId}`)

    return response.data.playlist
}