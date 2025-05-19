import axios from '../../../../config/axios'
import { WorkspaceEntityCounts } from '../../types'

type WorkspacesEntityCountsRequestResponse = {
	workspaceEntityCounts: WorkspaceEntityCounts
}

export const workspaceEntityCountsRequest = async (slug: string) => {
    const response = await axios.get<WorkspacesEntityCountsRequestResponse>(`/workspaces/${slug}/entityCounts`)

    return response.data.workspaceEntityCounts
}