import axios from '@/config/axios'
import { UserWorkspace } from '../../types'
import { PaginatedResponse } from '@/types'

type UserWorkspacesRequestResponse = PaginatedResponse<UserWorkspace>

export const userWorkspacesRequest = async (userId: string, page: number, limit: number) => {
    const response = await axios.get<UserWorkspacesRequestResponse>(`/users/${userId}/workspaces`, {
        params: {
            page,
            limit
        }
    })

    return response.data
}

export const userWorkspacesQuery = (userId: string, page: number = 1, limit: number = 10) => ({
    queryKey: ['userWorkspaces', { userId, page, limit }],
    queryFn: async () => {
        return await userWorkspacesRequest(userId, page, limit)
    },
})