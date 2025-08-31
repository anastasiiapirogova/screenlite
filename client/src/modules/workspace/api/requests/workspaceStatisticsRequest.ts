import axios from '@config/axios'
import { WorkspaceStatistics } from '../../types'

type WorkspacesStatisticsRequestResponse = {
	workspaceStatistics: WorkspaceStatistics
}

export const workspaceStatisticsRequest = async (id: string) => {
    const response = await axios.get<WorkspacesStatisticsRequestResponse>(`/workspaces/${id}/statistics`)

    return response.data.workspaceStatistics
}

export const workspaceStatisticsQuery = (workspaceId: string | undefined) => ({
    queryKey: ['workspaceStatistics', { workspaceId }],
    queryFn: async () => workspaceStatisticsRequest(workspaceId!),
    enabled: !!workspaceId,
})