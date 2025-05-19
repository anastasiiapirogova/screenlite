import { PaginatedRequestFilter, PaginatedResponse } from '@/types'
import axios from '../../../../config/axios'
import { Playlist } from '../../types'

export type WorkspacePlaylistsRequestResponse = PaginatedResponse<Playlist>

export type WorkspacePlaylistRequestFilters = PaginatedRequestFilter & {
    search?: string
    status?: string[]
    type?: string[]
    has_screens?: string[]
}

export const workspacePlaylistsRequest = async (slug: string, filters: WorkspacePlaylistRequestFilters) => {
    const response = await axios.get<WorkspacePlaylistsRequestResponse>(`/workspaces/${slug}/playlists`, {
        params: {
            ...filters,
        }
    })

    return response.data
}