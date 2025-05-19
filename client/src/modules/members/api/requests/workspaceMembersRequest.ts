import { PaginatedResponse } from '@/types'
import axios from '@config/axios'
import { Member } from '@modules/members/types'

export type WorkspaceMembersRequestData = {
    slug: string
    filters: {
        search?: string | null
    }
}

export type WorkspaceMembersRequestResponse = PaginatedResponse<Member>

export const workspaceMembersRequest = async (data: WorkspaceMembersRequestData) => {
    const response = await axios.get<WorkspaceMembersRequestResponse>(`/workspaces/${data.slug}/members`, {
        params: data.filters
    })

    return response.data
}