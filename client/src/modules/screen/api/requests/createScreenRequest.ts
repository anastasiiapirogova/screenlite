import axios from '../../../../config/axios'
import { CreateScreenRequestData, Screen } from '../../types'

type CreateScreenRequestResponse = {
	screen: Screen
}

export const createScreenRequest = async (data: CreateScreenRequestData) => {
    const response = await axios.post<CreateScreenRequestResponse>('/screens/create', data)

    return response.data.screen
}