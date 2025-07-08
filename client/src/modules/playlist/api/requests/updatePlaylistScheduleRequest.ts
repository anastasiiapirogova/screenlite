import axios from '@config/axios'
import { PlaylistSchedule, UpdatePlaylistScheduleRequestData } from '../../types'

type UpdatePlaylistScheduleResponse = {
	schedules: PlaylistSchedule[]
}

export const updatePlaylistScheduleRequest = async (data: UpdatePlaylistScheduleRequestData) => {
    const response = await axios.post<UpdatePlaylistScheduleResponse>('/playlistSchedules/update', data)

    return response.data.schedules
}