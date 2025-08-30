import axios from '@config/axios'
import { Workspace } from '../../types'

type WorkspacesRequestResponse = {
	workspace: Workspace
}

export const workspaceRequest = async (id: string) => {
    const response = await axios.get<WorkspacesRequestResponse>(`/workspaces/${id}`)

    return response.data.workspace
}

export const workspaceQuery = (id: string | undefined) => ({
    queryKey: ['workspace', { id }],
    queryFn: async () => workspaceRequest(id!),
    enabled: !!id,
})