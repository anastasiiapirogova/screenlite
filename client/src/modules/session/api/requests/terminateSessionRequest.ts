import axios from '@config/axios'

export type TerminateSessionRequestData = {
	sessionId: string
}

export const terminateSessionRequest = async (data: TerminateSessionRequestData) => {
    const response = await axios.post(
        '/sessions/terminate',
        data,
    )

    return response.data
}