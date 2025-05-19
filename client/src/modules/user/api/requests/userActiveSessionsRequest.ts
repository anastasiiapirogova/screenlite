import axios from '../../../../config/axios'
import { UserSession } from '../../types'

type UserActiveSessionsRequestResponse = {
	sessions: UserSession[]
}

export const userActiveSessionsRequest = async (userId: string) => {
    const response = await axios.get<UserActiveSessionsRequestResponse>(`/users/${userId}/activeSessions`)

    return response.data.sessions
}
