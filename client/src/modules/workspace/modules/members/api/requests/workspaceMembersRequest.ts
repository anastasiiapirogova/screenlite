import { PaginatedResponse } from '@/types'
import axios from '@config/axios'
import { Member } from '@modules/workspace/modules/members/types'

export type WorkspaceMembersRequestData = {
    workspaceId: string
    filters: {
        search?: string | null
        page?: number | null
        limit?: number | null
    }
}

type WorkspaceMembersRequestResponse = PaginatedResponse<Member>

export const workspaceMembersRequest = async (data: WorkspaceMembersRequestData) => {
    const response = await axios.get<WorkspaceMembersRequestResponse>(`/workspaces/${data.workspaceId}/members`, {
        params: data.filters
    })

    return response.data
}