import { PaginatedResponse } from '@/types'
import axios from '@config/axios'
import { WorkspaceFile } from '../types'

type WorkspaceFilesRequestResponse = PaginatedResponse<WorkspaceFile>

export type WorkspaceFilesRequestData = {
    id: string
    filters: {
        search?: string | null
        deleted?: boolean
        folderId?: string | null
    }
}

export const workspaceFilesRequest = async (data: WorkspaceFilesRequestData) => {
    const response = await axios.get<WorkspaceFilesRequestResponse>(`/workspaces/${data.id}/files`, {
        params: data.filters
    })

    return response.data
}

export const workspaceFilesQuery = (data: WorkspaceFilesRequestData) => ({
    queryKey: ['workspaceFiles', data],
    queryFn: async () => workspaceFilesRequest(data)
})