import axios from '@config/axios'
import { CreatePlaylistScheduleRequestData, PlaylistSchedule } from '../../types'

type CreatePlaylistScheduleResponse = {
	schedules: PlaylistSchedule[]
}

export const createPlaylistScheduleRequest = async (data: CreatePlaylistScheduleRequestData) => {
    const response = await axios.post<CreatePlaylistScheduleResponse>('/playlistSchedules/create', data)

    return response.data.schedules
}