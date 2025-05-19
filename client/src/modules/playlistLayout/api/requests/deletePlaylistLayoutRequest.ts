import axios from '@config/axios'

export type DeletePlaylistLayoutRequestData = {
    playlistLayoutId: string
}

export const deletePlaylistLayoutRequest = async (data: DeletePlaylistLayoutRequestData) => {
    await axios.post('/playlistLayouts/delete', data)
}