import axios from '../../../../config/axios'
import { RemoveScreensFromPlaylistRequestData } from '../../types'

type RemoveScreensFromPlaylistResponse = {
	screens: Screen
}

export const removeScreensFromPlaylistRequest = async (data: RemoveScreensFromPlaylistRequestData) => {
    const response = await axios.post<RemoveScreensFromPlaylistResponse>('/playlists/removeScreens', data)

    return response.data.screens
}