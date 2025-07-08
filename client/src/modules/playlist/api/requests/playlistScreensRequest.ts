import { Screen } from '@modules/screen/types'
import axios from '@config/axios'

type PlaylistScreensRequestResponse = {
	screens: Screen[]
}

export const playlistScreensRequest = async (id: string) => {
    const response = await axios.get<PlaylistScreensRequestResponse>(`/playlists/${id}/screens`)

    return response.data.screens
}