import axios from '@/config/axios'

type GetTotpSetupDataResponse = {
	secret: string
	authUrl: string
}

export const getTotpSetupDataRequest = async () => {
    const response = await axios.get<GetTotpSetupDataResponse>('/users/getTotpSetupData')

    return response.data
}