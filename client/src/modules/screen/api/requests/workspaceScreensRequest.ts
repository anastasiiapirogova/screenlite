import { Screen } from '@/modules/screen/types'
import axios from '../../../../config/axios'
import { PaginatedResponse } from '@/types'

export type ScreenWithPlaylists = Screen & { playlists: { playlistId: string }[] }

export type WorkspaceScreensResponse = PaginatedResponse<
    ScreenWithPlaylists | Screen
>

export type WorkspaceScreensRequestParams = {
    slug: string
}

export type WorkspaceScreensFilters = {
    playlistId?: string
    page: number
    limit: number
    search?: string
    status?: string[]
    type?: string[]
}

export const workspaceScreensRequest = async (slug: string, filters: WorkspaceScreensFilters) => {
    const response = await axios.get<WorkspaceScreensResponse>(`/workspaces/${slug}/screens`, {
        params: {
            ...filters
        }
    })

    return response.data
}