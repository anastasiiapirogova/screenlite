import { PaginatedRequestFilter, PaginatedResponse } from '@/types'
import axios from '@config/axios'
import { PlaylistLayout } from '../../types'

type WorkspacePlaylistLayoutsRequestResponse = PaginatedResponse<PlaylistLayout>

export type WorkspacePlaylistLayoutsRequestFilters = PaginatedRequestFilter & {
    search?: string | null
}

export const workspacePlaylistLayoutsRequest = async (workspaceId: string, filters: WorkspacePlaylistLayoutsRequestFilters) => {
    const response = await axios.get<WorkspacePlaylistLayoutsRequestResponse>(`/workspaces/${workspaceId}/playlistLayouts`, {
        params: {
            ...filters
        }
    })

    return response.data
}