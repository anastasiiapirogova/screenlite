import axios from '@config/axios'
import { PlaylistLayout } from '@modules/workspace/modules/playlistLayout/types.js'
import { PlaylistLayoutEditorLayoutSection } from '@modules/playlistLayoutEditor/types'

type UpdatePlaylistLayoutRequestResponse = {
	playlistLayout: PlaylistLayout
}

export type UpdatePlaylistLayoutRequestData = {
    playlistLayoutId: string
    name?: string
    resolutionWidth?: number
    resolutionHeight?: number
    sections?: PlaylistLayoutEditorLayoutSection[]
}

export const updatePlaylistLayoutRequest = async (data: UpdatePlaylistLayoutRequestData) => {
    const response = await axios.post<UpdatePlaylistLayoutRequestResponse>('/playlistLayouts/update', data)

    return response.data.playlistLayout
}