import { PaginatedRequestFilter, PaginatedResponse } from '@/types'
import axios from '@config/axios'
import { Playlist } from '../../types'

export type WorkspacePlaylistsRequestResponse = PaginatedResponse<Playlist>

export type WorkspacePlaylistRequestFilters = PaginatedRequestFilter & {
    search?: string
    status?: string[]
    type?: string[]
    has_screens?: string[]
}

export type WorkspacePlaylistsRequestData = {
    workspaceId: string
    filters: WorkspacePlaylistRequestFilters
}

export const workspacePlaylistsRequest = async (data: WorkspacePlaylistsRequestData) => {
    const response = await axios.get<WorkspacePlaylistsRequestResponse>(`/workspaces/${data.workspaceId}/playlists`, {
        params: {
            ...data.filters,
        }
    })

    return response.data
}