import axios from '@config/axios'
import { CreateScreenRequestData, Screen } from '../../types'

type CreateScreenRequestResponse = {
	screen: Screen
}

export const createScreenRequest = async (data: CreateScreenRequestData) => {
    const response = await axios.post<CreateScreenRequestResponse>(`/workspaces/${data.workspaceId}/screens`, data)

    return response.data.screen
}