import axios from '@/config/axios'

type GetTotpSetupDataResponse = {
	secret: string
	authUrl: string
}

export const getTotpSetupDataRequest = async (userId: string) => {
    const response = await axios.get<GetTotpSetupDataResponse>(`/users/${userId}/security/2fa/totpSetupData`)

    return response.data
}