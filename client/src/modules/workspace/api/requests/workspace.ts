import axios from '@config/axios'
import { Workspace } from '../../types'

type WorkspacesRequestResponse = {
	workspace: Workspace
}

export const workspaceRequest = async (slug: string) => {
    const response = await axios.get<WorkspacesRequestResponse>(`/workspaces/bySlug/${slug}`)

    return response.data.workspace
}

export const workspaceQuery = (slug: string) => ({
    queryKey: ['workspace', { slug }],
    queryFn: async () => workspaceRequest(slug)
})