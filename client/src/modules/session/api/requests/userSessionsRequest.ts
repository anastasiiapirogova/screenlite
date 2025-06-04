import { PaginatedResponse } from '@/types'
import axios from '@config/axios'
import { UserSession } from '@modules/user/types'

export type UserSessionsRequestResponse = PaginatedResponse<
	UserSession
>

export type UserSessionsRequestFilters = {
    page: number
    limit: number
    status?: 'active' | 'revoked'
}

export const userSessionsRequest = async (userId: string, filters: UserSessionsRequestFilters) => {
    const response = await axios.get<UserSessionsRequestResponse>(`/users/${userId}/sessions`, {
        params: {
            ...filters
        }
    })

    return response.data
}
