import axios from '../../../../config/axios'
import { AddScreensToPlaylistRequestData } from '../../types'

type AddScreensToPlaylistResponse = {
	screens: Screen[]
}

export const addScreensToPlaylistRequest = async (data: AddScreensToPlaylistRequestData) => {
    const response = await axios.post<AddScreensToPlaylistResponse>('/playlists/addScreens', data)

    return response.data.screens
}