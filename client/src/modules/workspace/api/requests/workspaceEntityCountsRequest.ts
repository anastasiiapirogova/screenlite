import axios from '@config/axios'
import { WorkspaceEntityCounts } from '../../types'

type WorkspacesEntityCountsRequestResponse = {
	workspaceEntityCounts: WorkspaceEntityCounts
}

export const workspaceEntityCountsRequest = async (id: string) => {
    const response = await axios.get<WorkspacesEntityCountsRequestResponse>(`/workspaces/${id}/entityCounts`)

    return response.data.workspaceEntityCounts
}