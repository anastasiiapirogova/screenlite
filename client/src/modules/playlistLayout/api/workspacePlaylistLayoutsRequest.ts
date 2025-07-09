import { PaginatedRequestFilter, PaginatedResponse } from '@/types'
import axios from '@config/axios'
import { PlaylistLayoutListItem } from '../types'

export type WorkspacePlaylistLayoutsRequestResponse = PaginatedResponse<PlaylistLayoutListItem>

export type WorkspacePlaylistLayoutsRequestFilters = PaginatedRequestFilter & {
    search?: string | null
}

export type WorkspacePlaylistLayoutsRequestData = {
    workspaceId: string,
    filters: WorkspacePlaylistLayoutsRequestFilters
}

export const workspacePlaylistLayoutsRequest = async (data: WorkspacePlaylistLayoutsRequestData) => {
    const response = await axios.get<WorkspacePlaylistLayoutsRequestResponse>(`/workspaces/${data.workspaceId}/playlistLayouts`, {
        params: data.filters
    })

    return response.data
}

export const workspacePlaylistLayoutsQuery = (data: WorkspacePlaylistLayoutsRequestData) => ({
    queryKey: ['workspacePlaylistLayouts', data],
    queryFn: async () => workspacePlaylistLayoutsRequest(data)
})