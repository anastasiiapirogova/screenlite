import axios from '../../../../config/axios'
import { DeletePlaylistScheduleRequestData, PlaylistSchedule } from '../../types'

type DeletePlaylistScheduleResponse = {
	schedules: PlaylistSchedule[]
}

export const deletePlaylistScheduleRequest = async (data: DeletePlaylistScheduleRequestData) => {
    const response = await axios.post<DeletePlaylistScheduleResponse>('/playlistSchedules/delete', data)

    return response.data.schedules
}