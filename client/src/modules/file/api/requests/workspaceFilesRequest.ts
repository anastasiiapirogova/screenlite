import { PaginatedResponse } from '@/types'
import axios from '../../../../config/axios'
import { WorkspaceFile } from '../../types'

type WorkspaceFilesRequestResponse = PaginatedResponse<WorkspaceFile>

export type WorkspaceFilesRequestData = {
    slug: string
    filters: {
        search?: string | null
        deleted?: boolean
        folderId?: string | null
    }
}

export const workspaceFilesRequest = async (data: WorkspaceFilesRequestData) => {
    const response = await axios.get<WorkspaceFilesRequestResponse>(`/workspaces/${data.slug}/files`, {
        params: data.filters
    })

    return response.data
}