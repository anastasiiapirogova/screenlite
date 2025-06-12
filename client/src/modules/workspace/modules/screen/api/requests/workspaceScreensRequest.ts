import { Screen } from '@modules/workspace/modules/screen/types'
import axios from '@config/axios'
import { PaginatedResponse } from '@/types'

export type ScreenWithPlaylists = Screen & { playlists: { playlistId: string }[] }

export type WorkspaceScreensResponse = PaginatedResponse<
    ScreenWithPlaylists | Screen
>

export type WorkspaceScreensFilters = {
    playlistId?: string
    search?: string | null
    deleted?: boolean
    page?: number
    limit?: number
}

export type WorkspaceScreensRequestData = {
    workspaceId: string
    filters: WorkspaceScreensFilters
}

export const workspaceScreensRequest = async (data: WorkspaceScreensRequestData) => {
    const response = await axios.get<WorkspaceScreensResponse>(`/workspaces/${data.workspaceId}/screens`, {
        params: {
            ...data.filters
        }
    })

    return response.data
}