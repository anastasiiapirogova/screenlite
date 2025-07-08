import axios from '@config/axios'
import { Screen } from '../../types'

type ScreenRequestResponse = {
	screen: Screen
}

export type ScreenRequestData = {
    screenId: string
    workspaceId: string
}

export const screenRequest = async (data: ScreenRequestData) => {
    const response = await axios.get<ScreenRequestResponse>(`/workspaces/${data.workspaceId}/screens/${data.screenId}`)

    return response.data.screen
}