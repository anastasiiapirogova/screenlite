import axios from '@config/axios'

type FilePlaylistsRequestResponse = {
    playlists: {
        id: string
        name: string
        isPublished: boolean
    }[]
}

export type FilePlaylistsRequestData = {
    fileId: string
    workspaceId: string
}

export const filePlaylistsRequest = async (data: FilePlaylistsRequestData) => {
    const response = await axios.get<FilePlaylistsRequestResponse>(`/workspaces/${data.workspaceId}/files/${data.fileId}/playlists`)

    return response.data.playlists
}

export const filePlaylistsQuery = (data: FilePlaylistsRequestData) => ({
    queryKey: ['filePlaylists', data],
    queryFn: async () => filePlaylistsRequest(data)
})