import axios from '@config/axios'

export type DeletePlaylistLayoutRequestData = {
    workspaceId: string
    playlistLayoutId: string
}

export const deletePlaylistLayoutRequest = async (data: DeletePlaylistLayoutRequestData) => {
    await axios.delete(`/workspaces/${data.workspaceId}/playlistLayouts/${data.playlistLayoutId}`)
}