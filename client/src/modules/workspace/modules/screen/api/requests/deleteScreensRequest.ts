import axios from '@config/axios'
import { DeleteScreensRequestData } from '../../types'

type DeleteScreensRequestResponse = {
	screenIds: string[]
}

export const deleteScreensRequest = async (data: DeleteScreensRequestData) => {
    const response = await axios.post<DeleteScreensRequestResponse>(`/workspaces/${data.workspaceId}/screens/delete`, data)

    return response.data.screenIds
}