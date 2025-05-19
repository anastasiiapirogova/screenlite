import axios from '@/config/axios'
import { UserWorkspace } from '../../types'

type UserWorkspacesRequestResponse = {
	workspaces: UserWorkspace[]
	page: number
	limit: number
	total: number
}

export const userWorkspacesRequest = async (userId: string, page: number, limit: number) => {
    const response = await axios.get<UserWorkspacesRequestResponse>(`/users/${userId}/workspaces`, {
        params: {
            page,
            limit
        }
    })

    return response.data
}