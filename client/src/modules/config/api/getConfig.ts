import axios from '@/config/axios'
import { ScreenliteConfig } from '../types'

type GetConfigResponse = {
	config: ScreenliteConfig
}

export const getConfigRequest = async () => {
    const response = await axios.get<GetConfigResponse>('/config/public')

    return response.data.config
}

export const configQuery = () => ({
    queryKey: ['config'],
    queryFn: getConfigRequest,
})