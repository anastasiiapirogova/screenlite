import axios from '../../../../config/axios'
import { Screen } from '../../types'

type ScreenRequestResponse = {
	screen: Screen
}

export const screenRequest = async (id: string) => {
    const response = await axios.get<ScreenRequestResponse>(`/screens/${id}`)

    return response.data.screen
}