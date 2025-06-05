import axios from '@config/axios'

export type TerminateAllSessionsRequestData = {
	userId: string
	excludeSessionId?: string
}

export const terminateAllSessionsRequest = async (data: TerminateAllSessionsRequestData) => {
    const response = await axios.post(
        '/sessions/terminateAll',
        data,
    )

    return response.data
}