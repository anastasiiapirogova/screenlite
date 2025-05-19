import { PaginatedRequestFilter, PaginatedResponse } from '@/types'
import axios from '../../../../config/axios'
import { PlaylistLayout } from '../../types'

type WorkspacePlaylistLayoutsRequestResponse = PaginatedResponse<PlaylistLayout>

export type WorkspacePlaylistLayoutsRequestFilters = PaginatedRequestFilter & {
    search?: string
}

export const workspacePlaylistLayoutsRequest = async (slug: string, filters: WorkspacePlaylistLayoutsRequestFilters) => {
    const response = await axios.get<WorkspacePlaylistLayoutsRequestResponse>(`/workspaces/${slug}/playlistLayouts`, {
        params: {
            ...filters
        }
    })

    return response.data
}